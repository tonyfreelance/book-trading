'use strict';

angular
    .module('BookTradingApp')
    .factory('bookService', bookService);

bookService.$inject = ['$http'];

function bookService($http) {
    var service = {
        addBook: addBook,
        approveRequest: approveRequest,
        deleteBook: deleteBook,
        deleteRequest: deleteRequest,
        getAllBooks: getAllBooks,
        getBooks: getBooks,
        getMyRequests: getMyRequests,
        getOtherRequests: getOtherRequests,
        requestBook: requestBook,
    };
    
    return service;
    ////////////////////////////////////
    
    function addBook(searchTerm, userId) {
        return $http.get('/addBook', {
            params: {
                searchTerm: searchTerm,
                userId: userId
            }
        });
    }
    
    function approveRequest(userId, owner, index) {
        return $http.get('/approveRequest', {
            params: {
                userId: userId,
                owner: owner,
                index: index
            }
        });
    }
    
    function deleteBook(bookId) {
        return $http.get('/deleteBook', {
            params: {
                bookId: bookId
            }
        });
    }
    
    function deleteRequest(deleteType, index, userId) {
        return $http.get('/deleteRequest', {
            params: {
                userId: userId,
                deleteType: deleteType,
                index: index
            }
        });
    }
    
    function getAllBooks(userId) {
        return $http.get('/getAllBooks');
    }
    
    function getBooks(userId) {
        return $http.get('/getBooks', {
           params: {
               userId: userId
           } 
        });
    }
    
    function getMyRequests(userId) {
        return $http.get('/myRequests', {
            params: {
                userId: userId
            }
        });
    }
    
    function getOtherRequests(userId) {
        return $http.get('/otherRequests', {
            params: {
                userId: userId
            }
        });
    }
    
    function requestBook(userId, book) {
        return $http.get('/requestBook', {
            params: {
                userId: userId,
                owner: book.owner,
                name: book.name,
                cover: book.cover
            }
        });
    }
}