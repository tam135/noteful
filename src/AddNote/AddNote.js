import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import PropTypes from 'prop-types';
import ValidationError from '../errorboundary/ValidationError';

export default class AddNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            name: '',
            nameValid: false,
            formValid: false,
            validationMessages: {
                name: ''
            }
        };
    }

    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object
        }),
        history: PropTypes.shape({
            push: PropTypes.func
        }).isRequired
    };

    static contextType = ApiContext;



    formValid() {
        this.setState({
            formValid: this.state.nameValid
        });
    }

    updateName(name) {
        this.setState({ name }, () => {
            this.validateName(name);
        });
    }

    updateFolder(folder) {
        this.setState({ folder }, () => {
            this.validateFolder(folder);
        });
    }

    handleSubmit = e => {
        e.preventDefault()
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folderId: e.target['note-folder-id'].value,
            modified: new Date(),
        }
        fetch(config.API_ENDPOINT_NOTE, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote),
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(note => {
                this.context.addNote(note)
                this.props.history.push(`/folder/${note['folder_id']}`)
            })
            .catch(error => {
                console.error({ error })
            })
    }

    validateName = fieldValue => {
        const fieldErrors = { ...this.state.validationMessages };
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.name = 'Name is required';
            hasError = true;
        }
        this.props.folders.forEach(folder => {
            if (folder.name === fieldValue) {
                fieldErrors.name = 'There is already a folder with this name';
                hasError = true;
            }
        });

        this.setState(
            {
                validationMessages: fieldErrors,
                nameValid: !hasError
            },
            this.formValid
        );
    };
    validateFolder = fieldValue => {
        const fieldErrors = { ...this.state.validationMessages };
        let hasError = false;

        fieldValue = fieldValue.trim();
        this.props.folders.forEach(folder => {
            if (folder.id === fieldValue) {
                fieldErrors.folder = '';
                hasError = false;
            }
        });
        if (hasError === true) {
            fieldErrors.folder = 'Must select a folder';
            hasError = true;
        }

        this.setState(
            {
                validationMessages: fieldErrors,
                folderValid: !hasError
            },
            this.formValid
        );
    };


    render() {
        const folders = this.props.folders;
  
        //if (!folders || folders.length <= 0) {
            // Display a message or Show a Loading Gif here
        //    return <div>Loading...</div>;
        //}

        return (
            <section className='AddNote'>
                <h2>Create a note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input 
                            type='text' 
                            id='note-name-input'
                            name='note-name' 
                            onChange={e => this.updateName(e.target.value)}
                        />
                        <ValidationError
                            hasError={!this.state.nameValid}
                            message={this.state.validationMessages.name}
                        />
                    </div>
                    
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <textarea id='note-content-input' name='note-content' />
                    </div>

                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                         </label>

                        <select 
                            id='note-folder-select' 
                            name='note-folder-id'
                            onChange={e => this.updateFolder(e.target.value)}>

                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            )}
                        </select>
                        <ValidationError
                            hasError={!this.state.folderValid}
                            message={this.state.validationMessages.folder}
                        />

                    </div>

                    <div className='buttons'>
                        <button 
                            type='submit'
                            disabled={!this.state.formValid}>
                            Add note
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}