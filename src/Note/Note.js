import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import config from '../config';
//helper functions
import { findFolder } from '../notes-helpers';
//handle Errors
import ValidationError from '../errorboundary/ValidationError';
//css
import '../AddNote/AddNote.css';
class UpdateNote extends Component {
  state = {
    id: '',
    name: '',
    folder_id: '',
    content: '',
    nameValid: false,
    formValid: false,
    validationMessages: {
      name: ''
    }
  };

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

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

  formValid() {
    this.setState({
      formValid: this.state.nameValid
    });
  }
  //prettier-ignore
  componentDidMount() {
    const { noteId } = this.props.match.params;
    fetch(config.API_ENDPOINT_NOTE + `/${noteId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));

        return res.json();
      })
      .then(responseData => {
        this.updateName(responseData.name);
        this.updateFolder(responseData['folder_id']);
        this.updateContent(responseData.content);
      })
      .catch(error => {
        console.error(error);
      })
  }
  //prettier-ignore
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

  validateName = fieldValue => {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    } else {
      fieldErrors.name = '';
      hasError = false;
    }

    this.setState(
      {
        validationMessages: fieldErrors,
        nameValid: !hasError
      },
      this.formValid
    );
  };

  render() {
    const folders = this.props.folders;
    let getFolder = {};
    if (!folders || folders.length <= 0) {
      // Display a message or Show a Loading Gif here
      return <div>Loading...</div>;
    } else {
      getFolder = findFolder(folders, this.state['folder_id']);
    }
    if (!getFolder) {
      // Display a message or Show a Loading Gif here
      return <div>Loading...</div>;
    }
    const { name } = this.state;
    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <form className="editnote-form" action="#" onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="note-name-input">Name</label>
            <input
              type="text"
              id="note-name-input"
              name="note-name"
              defaultValue={name}
              onChange={e => this.updateName(e.target.value)}
            />
            <ValidationError
              hasError={!this.state.nameValid}
              message={this.state.validationMessages.name}
            />
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              name="note-content"
              value={this.state.content}
              onChange={e => this.updateContent(e.target.value)}
            />
          </div>
          <div className="field">
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
            <ValidationError
              hasError={!this.state.folderValid}
              message={this.state.validationMessages.folder}
            />
          </div>
          <div className="buttons">
            <button
              type="submit"
              className="registration__button"
              disabled={!this.state.formValid}
            >
              Add edited note
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default withRouter(UpdateNote);