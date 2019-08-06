import React, { Component } from 'react'

export default class updateNote extends Component {
    componentDidMount() {
        const noteId = this.props.match.params.noteId
        fetch(`https://localhost:8000/api/note/${noteId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })  
            .then(/* content */)
            .then(respondeData => {
                this.context.updateNote(responseData)
                })
            .catch(error => {/* content */})
    }

    handleSubmit = e => {
        e.preventDefault()
        // validation
        fetch(`https://localhost:8000/api/note/${this.props.match.params.articleId}`, {
            method: 'PATCH',
            body: JSON.stringify(this.state.inputValues)
        })
            .then(/* some content */)
    }

    render() {
        const { name, folder_id, content} = this.state
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
