import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ApiContext from '../ApiContext'
import config from '../config'
import './App.css'
import UpdateNote from '../UpdateNote/UpdateNote'

class App extends Component {
    state = {
        notes: [],
        folders: [],
        error: null,
    };

    setFolder = folders => {
        this.setState({folders, error: null});
    }

    setNotes = notes => {
        this.setState({ notes, error: null });
    };

    handleAddFolder = folder => {
        this.setState({
            folders: [
                ...this.state.folders,
                folder
            ]
        })
    }

    handleAddNote = note => {
        this.setState({
            notes: [
                ...this.state.notes,
                note
            ]
        })
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        })
    }

    handleUpdateNote = updatedNote => {
        const newNotes = this.state.notes.map(n =>
            (n.id === updatedNote.id)
                ? updatedNote
                : n
        )
        this.setState({
            notes: newNotes
        })
    }
    
    componentDidMount() {
        Promise.all([
            fetch(config.API_ENDPOINT_FOLDER, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${config.API_KEY}`
                }
            }),
            fetch(config.API_ENDPOINT_NOTE, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${config.API_KEY}`
                }
            })
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e))
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e))

                return Promise.all([
                    notesRes.json(),
                    foldersRes.json(),
                ])
            })
            .then(([notes, folders]) => {
                this.setState({ notes, folders, error: null })
            })
            .catch(error => {
                console.error({ error })
            })
    }

    renderNavRoutes() {
        const notes = this.state.notes;
        const folders = this.state.folders;
        return (
            <>
                {['/', '/folder/:folderId'].map(path =>
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav folders={folders} notes={notes} {...routeProps}/>
                        )}
                    />
                )}
                <Route
                    path='/note/:noteId'
                    component={NotePageNav}
                />
                <Route
                    path='/add-folder'
                    component={NotePageNav}
                />
                <Route
                    path='/add-note'
                    component={NotePageNav}
                />
            </>
        )
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path =>
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                )}
                <Route
                    path='/note/:noteId'
                    component={NotePageMain}
                />
                <Route
                    path='/add-folder'
                    render={routeProps => {
                        return (
                            <AddFolder
                                {...routeProps}
                                folders={this.state.folders}
                                addFolder={this.handleAddFolder}
                            />
                        )
                    }}
                />
                <Route
                    path="/add-note"
                    render={routeProps => (
                        <AddNote
                            {...routeProps}
                            addNote={this.handleAddNote}
                            folders={this.state.folders}
                        />
                    )}
                />
                <Route
                    path="/update-note/:noteId"
                    render={routeProps => (
                        <UpdateNote
                            {...routeProps}
                            updateNote={this.handleUpdateNote}
                            folders={this.state.folders}
                        />
                    )}
                />    
            </>
        )
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote,
            deleteNote: this.handleDeleteNote,
            updateNote: this.handleUpdateNote,
        }
        return (
            <ApiContext.Provider value={value}>
                <div className='App'>
                    <nav className='App__nav'>
                        {this.renderNavRoutes()}
                    </nav>
                    <header className='App__header'>
                        <h1>
                            <Link to='/'>Noteful</Link>
                            {' '}
                            <FontAwesomeIcon icon='check-double' />
                        </h1>
                    </header>
                    <main className='App__main'>
                        {this.renderMainRoutes()}
                    </main>
                </div>
            </ApiContext.Provider>
        )
    }
}

export default App
