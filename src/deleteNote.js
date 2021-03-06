import React from 'react';

function deleteNote(noteId, callBack) {
    fetch(config.API_ENDPOINT_NOTE + `/${noteId}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" }
    })
        .then(res=> {
            if(!res.ok) {
                return res.json().then(error => {
                    throw Error;
                })
            }
            return res.json();
        })
        .then(data=>{
            callback(noteId);
        })
        .catch(error => {
            console.log(error);
        })
}

export default deleteNote