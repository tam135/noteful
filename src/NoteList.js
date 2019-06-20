import React from 'react';
import NoteItem from './NoteItem';

export default function AllNotes(props) {
        
    const notes = props.notes.map(note => <NoteItem {...note}/>);
        
        return (
            
            <ul className="noteList">
                { notes }
            </ul>
        )
    
}

AllNotes.defaultProps = {
    notes: []
}