//bookmarkModel.js


const mongoose = require('mongoose');

const bookmarksSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }

});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

const Bookmarks = {
    createBookmark: function (newBookmark) {
        return bookmarksCollection
            .create(newBookmark)
            .then(createdBookmark => {
                return createdBookmark;
            })
            .catch(err => {
                return err;
            })
    },
    getAllBookmarks: function () {
        return bookmarksCollection
            .find()
            .then(allBookmarks => {
                return allBookmarks;
            })
            .catch(err => {
                return err;
            })
    },
    getBookmarksByTitle: function (title_input) {
        return bookmarksCollection
            .find({ title: title_input })
            .then(found_bookmarks => {
                return found_bookmarks;
            })
            .catch(err => {
                return err;
            })
    },
    deleteBookmarkById: function (id_input) {
        return bookmarksCollection
            .deleteMany({ id: id_input })
            .then(result => {
                //console.log("Sent a delete request to the db. Here's what we got back:", result);
                return result;
            })
            .catch(err => {
                return err;
            })
    },
    
    updateById: function (id_input,updates) {
        return bookmarksCollection
            .findOneAndUpdate({ id: id_input }, updates, { new: true })
            .then(result => {
                return result;
            })
            .catch(err => {
                return err;
            })
    }

};

module.exports = { Bookmarks };