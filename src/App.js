import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './Header';
import NoteList from './NoteList';
import NavFolders from './NavFolders';
import NoteDetail from './NoteDetail';
import dummyStore from './dummyStore';
import BackButton from './BackButton';

class App extends Component {
  state = {
    store: dummyStore
  }
  
  render() {
    //<Route path='/' component={BackButton} />
    
    return (
      <div>
        <Header />
        <div className="main-section">
          <nav>
            <Switch>
              <Route exact path='/' render={() => <NavFolders folders={this.state.store.folders}/>}/>
              <Route path='/folders/:folderId' render={() => <NavFolders folders={this.state.store.folders} />} />
              <Route path='/notes/:noteId' render={() => <NavFolders folders={this.state.store.folders} />} />
              <Route path='/notes/:noteId' component={BackButton} />
            </Switch>
          </nav>
          <main>
            <Route exact path='/' render={() => <NoteList notes={this.state.store.notes}/>}/>
            <Route path='/folders/:folderId' render={(props) => <NoteList notes={this.state.store.notes.filter(note => props.match.params.folderId === note.folderId)}/>}/>
            <Route path='/folders/:folderId' render={() => <NavFolders folders={this.state.store.folders} />} />
            <Route path='/notes/:noteId' render={(props) => <NoteDetail noteInfo={this.state.store.notes.find(note => note.id === props.match.params.noteId )} />}/>
            
          </main>
        </div>  
    </div>
    );
  }
}

export default App;