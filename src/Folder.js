import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Folder extends Component {
    render() {
        const folderId = `/folders/${this.props.id}`;

        return (
            
                <li key={this.props.id}>
                    <NavLink to={folderId}>
                        <p>{this.props.name}</p>
                    </NavLink>    
                </li>
        )
    }
}