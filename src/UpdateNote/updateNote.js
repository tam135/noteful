import React, { Component } from 'react'
import PropTypes from 'prop-types';
import config from '../config'
import ApiContext from '../Apicontext'

export default class updateNote extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object,
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    };

    static contextType = ApiContext;

    state = {
        error: null,
        id: '',
        name: '',
        folder_id: '',
        content: '',
    }
    componentDidMount() {
        const noteId = this.props.match.params.noteId
        fetch(config.API_ENDPOINT_NOTE + `/${noteId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })  
            .then(res => {
                if (!res.ok)
                    return res.json().then(error => Promise.reject(error))

                return res.json()
            })
            .then(responseData => {
                this.context.updateNote(responseData)
                })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })
    }

    updateName(name) {
        this.setState({ name }, () => {
            this.validateName(name);
        });
    }

    updateContent(content) {
        this.setState({ content });
    }

    updateFolder(folder_id) {
        this.setState({ folder_id });
    }

    handleSubmit = e => {
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folder_id: e.target['note-folder-id'].value

        };
        const { noteId } = this.props.match.params;
        fetch(config.API_ENDPOINT_NOTE + `${noteId}`, {
            method: 'PATCH',
            body: JSON.stringify(newNote),
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${config.API_KEY}`
            }

        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(e => Promise.reject(e));
                }
                return res.json();
            })
            .then(note => {
                this.context.updateNote(note)
                this.props.history.push('/')
            })
            .catch(error => {
                console.error({ error });
            });
    };

    render() {
        const { name} = this.state
        return (
            <section className='UpdateNoteForm'>
                <h2>Update Note</h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="note-name-input">Name</label>
                    <input
                        type="text"
                        id="note-name-input"
                        name="note-name"
                        Value={name}
                        onChange={e => this.updateName(e.target.value)}
                    />

                    <label htmlFor="note-content-input">Content</label>
                    <textarea
                        id="note-content-input"
                        name="note-content"
                        value={this.state.content}
                        onChange={e => this.updateContent(e.target.value)}
                    />

                    <label htmlFor="note-folder-select">Folder</label>
                    <select
                        id="note-folder-select"
                        name="note-folder-id"
                        selected={getFolder['folder_name']}
                        onChange={e => this.updateFolder(e.target.value)}
                    >
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                                {folder.folder_name}
                            </option>
                        ))}
                    </select>
                </form>
            </section>
        )
    }
}
