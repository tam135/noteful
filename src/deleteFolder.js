import React from 'react';

function deleteFolder(FolderId, callBack) {
    fetch(config.API_ENDPOINT_FOLDER + `/${FolderId}`, {
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
            callback(FolderId);
        })
        .catch(error => {
            console.log(error);
        })
}

export default deleteFolder