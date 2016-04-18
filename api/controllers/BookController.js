/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    addBook: function(req, res) {
        var searchTerm = req.param('searchTerm');
        var userId = req.param('userId');

        request.get({
            url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm
        }, function(error, response, body) {
            if (error) {
                return res.negotiate(error);
            }
            else {
                var data = JSON.parse(body);
                var book = {};
                if (data.items[0].volumeInfo.imageLinks) {
                    book.name = data.items[0].volumeInfo.title;
                    book.cover = data.items[0].volumeInfo.imageLinks.smallThumbnail;
                    book.owner = userId;
                }
                else {
                    book.name = data.items[0].volumeInfo.title;
                    book.cover = 'https://placehold.it/128x195';
                    book.owner = userId;
                }

                Book.create(book)
                    .exec(function(err, result) {
                        if (err)
                            return res.negotiate(err);
                        return res.send(result);
                    });
            }
        });
    },

    deleteBook: function(req, res) {
        var bookId = req.param('bookId');

        Book.destroy({
                id: bookId
            })
            .exec(function(err, result) {
                if (err)
                    return res.negotiate(err);

                return res.send(result);
            });
    },

    getAllBooks: function(req, res) {
        Book.find()
            .exec(function(err, results) {
                if (err)
                    return res.negotiate(err);

                return res.send(results);
            });
    },
    
    
    
    
};
