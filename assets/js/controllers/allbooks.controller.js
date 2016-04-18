'use strict';

angular
    .module('BookTradingApp')
    .controller('AllBooksController', AllBooksController);

AllBooksController.$inject = ['logger', 'bookService', '$cookies'];

function AllBooksController(logger, bookService, $cookies) {
    var vm = this;
    vm.books = [];
    vm.isOwner = isOwner;
    vm.requestBook = requestBook;

    activate();

    function activate() {
        return showAllBooks();
    }

    function isOwner(book) {
        return book.owner === $cookies.get('userId');
    }

    function requestBook(book) {
        return bookService.requestBook($cookies.get('userId'), book)
            .then(function() {
                logger.success('You\'ve successfully requested a trade on this book!');
                book.isDisabled = true;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function showAllBooks() {
        return bookService.getAllBooks()
            .then(function(results) {
                vm.books = results.data;
                return vm.books;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }
}
