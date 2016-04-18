'use strict';

angular
    .module('BookTradingApp')
    .controller('MyBooksController', MyBooksController);

MyBooksController.$inject = ['logger', 'bookService', '$cookies'];

function MyBooksController(logger, bookService, $cookies, $scope) {
    var vm = this;
    vm.addBook = addBook;
    vm.approveRequest = approveRequest;
    vm.books = [];
    vm.deleteBook = deleteBook;
    vm.deleteRequest = deleteRequest;
    vm.isShowMyRequests = false;
    vm.isShowOtherRequests = false;
    vm.myRequestsNo = '';
    vm.myRequests = {};
    vm.otherRequestsNo = '';
    vm.otherRequests = {};
    vm.searchTerm = '';
    vm.showMyRequests = showMyRequests;
    vm.showOtherRequests = showOtherRequests;

    activate();

    function activate() {
        return showBooks();
    }

    function addBook() {
        return bookService.addBook(vm.searchTerm, $cookies.get('userId'))
            .then(function(results) {
                // logger.success(results.data);
                vm.searchTerm = '';
                vm.books.push(results.data);
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function approveRequest(userId, owner, index) {
        return bookService.approveRequest(userId, owner, index)
            .then(function(result) {
                logger.success('You\'ve successfully approved this request!');
                // logger.success(result);
                vm.otherRequestsNo = result.data.changeOtherRequest[0].otherRequestWaiting.length;
                vm.otherRequests.waiting = result.data.changeOtherRequest[0].otherRequestWaiting;
                vm.otherRequests.approved = result.data.changeOtherRequest[0].otherRequestApproved;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function deleteBook(book, index) {
        return bookService.deleteBook(book.id)
            .then(function(result) {
                vm.books.splice(index, 1);
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function deleteRequest(deleteType, index) {
        return bookService.deleteRequest(deleteType, index, $cookies.get('userId'))
            .then(function() {
                if (deleteType === 'myRequestWaiting')
                    vm.myRequests.waiting.splice(index, 1);
                else if (deleteType === 'myRequestApproved')
                    vm.myRequests.approved.splice(index, 1);
                else if (deleteType === 'otherRequestWaiting')
                    vm.otherRequests.waiting.splice(index, 1);
                else
                    vm.otherRequests.approved.splice(index, 1);
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function showBooks() {
        return bookService.getBooks($cookies.get('userId'))
            .then(function(results) {
                // logger.success(results.data);
                if (results.data.books)
                    vm.books = results.data.books;

                if (typeof results.data.myRequestWaiting !== 'undefined' && results.data.myRequestWaiting.length > 0) {
                    vm.myRequestsNo = results.data.myRequestWaiting.length;
                }
                else {
                    vm.myRequestsNo = 0;
                }

                if (typeof results.data.otherRequestWaiting !== 'undefined' && results.data.otherRequestWaiting.length > 0) {
                    vm.otherRequestsNo = results.data.otherRequestWaiting.length;
                }
                else {
                    vm.otherRequestsNo = 0;
                }

                return vm.books;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function showMyRequests() {
        return bookService.getMyRequests($cookies.get('userId'))
            .then(function(results) {
                vm.myRequests.waiting = results.data.waiting;
                vm.myRequests.approved = results.data.approved;
                vm.isShowMyRequests = !vm.isShowMyRequests;
                vm.isShowOtherRequests = false;

                return vm.myRequests;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function showOtherRequests() {
        return bookService.getOtherRequests($cookies.get('userId'))
            .then(function(results) {
                // logger.success(results.data);
                vm.otherRequests.waiting = results.data.waiting;
                vm.otherRequests.approved = results.data.approved;
                vm.isShowOtherRequests = !vm.isShowOtherRequests;
                vm.isShowMyRequests = false;
                
                return vm.otherRequests;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }
}
