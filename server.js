//server.js for Lab 8

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const uuid = require('uuid');
const { Bookmarks } = require('./models/bookmarkModel');
const cors = require('./middleware/cors');
const Authenticate = require('./middleware/Authenticate');
const { DATABASE_URL, PORT } = require('./config');
const app = express();

//app.use(Authenticate)

app.use(cors);

app.use(express.static("public"));

app.use(morgan('dev'));
//Can be sent as a bearer token or book-api-key header
//Or parameter: apiKey . middleware should authenticate
//if not sent, send back unauthorized response with 401

let bookmarks = [
    {
        id: uuid.v4(),
        "title": "Google",
        description: "A useful search engine.",
        url: "http://www.google.com",
        rating: 3.5
    },
    {
        id: uuid.v4(),
        title: "Minesweeper Online",
        description: "A blast from the past",
        url: "minesweeperonline.com/",
        rating: 1
    }

];



app.get('/bookmarks', Authenticate, (req, res) => {
    //send back as a response all the existing bookmarks with 200 status
    console.log("getting all bookmarks");

    Bookmarks   
        .getAllBookmarks()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database.";
            return res.status(500).end();
        })
    
});

app.get('/bookmark', Authenticate, (req, res) => {
    //validate that the title is passed in the querystring, else 406
    //validate that the title exists or 404 not found
    //On success, send back 200 status with array of bookmarks holding title (e.i. repeated)

    let foundMarks = [];

    if (!req.query.title) {
        res.statusMessage = "Please include 'title' in the parameters of your request.";
        return res.status(406).end();
    }

    Bookmarks.getBookmarksByTitle(req.query.title)
        .then(result => {
            if (!result.length) {
                res.statusMessage = "No bookmark found with the given title";
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database.";
            return res.status(500).end();
        })
    


    
    

});

app.post("/bookmarks", [Authenticate,jsonParser],(req, res) => {
    //send bookmark in body of request, all fields except id
    //auto generate uuid
    //validate that all fields are received. If not, 406
    //if success, respond 201 w/ new bookmark
    if (!(req.body.title && req.body.description && req.body.url && req.body.rating)) {
        res.statusMessage = "Not enough information. Please send necessary fields in the body of request.";
        return res.status(406).end();
    }
    
    let postMe = {
        id: uuid.v4(),
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        rating: req.body.rating
    }

    Bookmarks
        .createBookmark(postMe)
        .then( result => {
            if (result.errmsg) {
                res.statusMessage = "The 'id' belongs to another bookmark" +
                    result.errmsg;
                return res.status(409).end();
            }
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the database.";
            return res.status(500).end();
        })




});

app.delete('/bookmark/:id', Authenticate, (req, res) => {

    let id = req.params.id;

    if (!id) {
        res.statusMessage = "No ID provided.";
        return res.status(404).end();
    }

    Bookmarks
        .deleteBookmarkById(req.params.id)
        .then(result => {
            if (result.ok) {
                return res.status(204).end();
            }
        })
        .catch(err => {
            res.statusMessage = "Oh no! Something is wrong with the database.";
            return res.status(500).end();
        })

    //validate that the id exists. If not, return 404
    //if successful, send back 200
});

app.patch('/bookmark/:id', [jsonParser, Authenticate],(req, res) => {
    //send id in body; if missing return 406
    //validate id from body and path are same. else 409
    //pass object in body with updated content: can have 1 to 4 fields
    //send relevant message in response

    let updates = {};

    let id = req.params.id; 
    let id2 = req.body.id;

    res.statusMessage = "Changes: ";
    
    if (!id2) {
        res.statusMessage = "Please pass 'id' in body of request.";
        return res.status(406).end();
    }

    if (!id) {
        res.statusMessage = "Please enter 'id' in the url: /bookmark/${id}";
        return res.status(404).end();
    }

    if (id !== id2) {
        res.statusMessage = "Please enter same 'id' in url and body.";
        return res.status(409).end();
    }

    if (req.body.title) {
        updates.title = req.body.title;
        res.statusMesage += "Title ";
    }
    if (req.body.description) {
        updates.description = req.body.description;
        res.statusMessage += "Description ";
    }
    if (req.body.url) {
        updates.url = req.body.url;
        res.statusMessage += "URL ";
    }
    if (req.body.rating) {
        updates.rating = req.body.rating;
        res.statusMessage += "Rating ";
    }

    Bookmarks
        .updateById(id2, updates)
        .then(result => {
            if (result.errmsg) {
                return res.status(409).end();
            }
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something's wrong with the database.";
            return res.status(500).end();
        })

    

});


app.listen(PORT, () => {
    //console.log("This server is running on port 8080.");

    new Promise((resolve, reject) => {
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };

        mongoose.connect(DATABASE_URL, settings, (err) => {
            if (err) {
                return reject(err);
            }
            else {
                console.log("database connected successfully");
                return resolve();
            }
        })
    })
        .catch(err => {
            console.log(err);
        })
});


//Get requests: http://localhost:8080/bookmarks
//Get requests by id: http://localhost:8080/bookmark?id=123
