import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './Addfolder.css'
import ValidationError from '../errorboundary/ValidationError';

export default class AddFolder extends Component {
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

    static defaultProps = {
        history: {
            push: () => { }
        },
    }
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

    handleSubmit = e => {
        e.preventDefault()
        const folder = {
            name: e.target['folder-name'].value
        }
        fetch(config.API_ENDPOINT_FOLDER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${config.API_KEY}`
            },
            body: JSON.stringify(folder),
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()                
            })
            .then(folder => {
                this.context.addFolder(folder)
                this.props.history.push(`/folder/${folder.id}`)
            })
            .catch(error => {
                console.error({ error })
                this.setState({ error })
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


    render() {
        return (
            <section className='AddFolder'>
                <h2>Create a folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                    </label>
                        <input 
                            type='text' 
                            id='folder-name-input' 
                            name='folder-name' 
                            onChange={e => this.updateName(e.target.value)}
                            required
                        />
                        <ValidationError
                            hasError={!this.state.nameValid}
                            message={this.state.validationMessages.name}
                        />
                    </div>

                    <div className='buttons'>
                        <button 
                            type='submit'
                            disabled={!this.state.formValid}>
                            Add folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

