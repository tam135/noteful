import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NoteItem extends Component {

    render() {
        const noteId = `/notes/${this.props.id}`;
        
        return (
            <li key={this.props.id}>
                
                    <div className="note">
                        <h3>
                        <Link to={noteId}>{this.props.name}</Link></h3>
                        <p>Modified {this.props.modified}</p>
                    </div>
             
            </li>
        )
    }
}