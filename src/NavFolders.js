import React, { Component } from 'react';
import Folder from './Folder';

export default class NavFolders extends Component {
    render() {
       
        const folders = this.props.folders.map(folder => <Folder {...folder} />)

        return (
            <ul class ="nav-folders">
                { folders }
            </ul>
        )
    }
}