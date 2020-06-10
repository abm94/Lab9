
let API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';
//let BASE_URL = "http://localhost:8080";

const BASE_URL = "";
/*
 a. List all the bookmarks when the page loads.
 b. Have a form to POST a new bookmark and update the list on the success.
 c. Have a form to DELETE a bookmark and update the list on the success.
 d. Have a form for UPDATING a bookmark and modify the list on the success.
 e. Have a form to GET bookmarks by title and display the results.
 f. Show error messages in case they are sent back as responses.
 */



function addBookmarkFech( _title, _description, _url, _rating ){
    let url = BASE_URL + '/bookmarks';

    let data = {
        title : _title,
        description: _description,
        url: _url,
        rating: _rating
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updateBookmarkFetch(id, title, description, url, rating) {
    let fetchUrl = BASE_URL + `/bookmark/${id}`;
    let data = {};
    let results = document.querySelector('.results');

    if (!id) {
        results.innerText = "No url provided.";
        return;
    }
    data.id = id;
    if (title) {
        data.title = title;
    }
    if (description) {
        data.description = description;
    }
    if (url) {
        data.url = url;
    }
    if (rating) {
        data.rating = rating;
    }
    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(fetchUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function deleteBookmarkFetch(_id) {
    let url = `/bookmark/${ _id }`;
    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type':'application/json'
        }
    }
    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                console.log(response);
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .catch(err => {
            results.innerText = err.message;
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type' : "Application/JSON"
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `<div> ${responseJSON[i].title} </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function watchBookmarksForm(){
    let bookmarksForm = document.querySelector( '.bookmarks-form' );

    bookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchBookmarks();
    });
}

function watchAddBookmarkForm(){
    let bookmarksForm = document.querySelector( '.add-bookmark-form' );

    bookmarksForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('titleInput').value;
        let description = document.getElementById('descriptionInput').value;
        let url = document.getElementById('urlInput').value;
        let rating = document.getElementById('ratingInput').value;

        addBookmarkFech(title, description, url, rating);
    });
}

function watchDeleteBookmarkForm() {
    let deleteform = document.querySelector('.delete-form');

    deleteform.addEventListener('submit', (event) => {
        event.preventDefault();
        let id = document.getElementById('idInput').value;

        deleteBookmarkFetch(id);
    })
}

function watchUpdateForm() {
    let updateButton = document.querySelector('#submitUpdate');
    updateButton.addEventListener('click', (event) => {
        event.preventDefault(); //id title des url rating
        let id = document.getElementById('uID').value;
        document.getElementById('uID').value = "";
        let title = document.getElementById('uTitle').value;
        document.getElementById('uTitle').value = "";
        let description = document.getElementById('uDescription').value;
        document.getElementById('uDescription').value = "";
        let url = document.getElementById('uUrl').value;
        document.getElementById('uUrl').value = "";
        let rating = document.getElementById('uRating').value;
        document.getElementById('uRating').value = null;


        updateBookmarkFetch(id, title, description, url, rating);
    })
}

function init(){
    watchBookmarksForm();
    watchAddBookmarkForm();
    watchDeleteBookmarkForm();
    watchUpdateForm();
    fetchBookmarks();
}

init();