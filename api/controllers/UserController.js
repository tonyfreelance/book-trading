/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jwt-simple');
var moment = require('moment');
var TOKEN_SECRET = 'tonyfreelance';
var async = require("async");

module.exports = {

	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},

	approveRequest: function(req, res) {
		var userId = req.param('userId');
		var owner = req.param('owner');
		var index = req.param('index');
		var myRequestApproved = [];
		var otherRequestApproved = [];

		async.parallel({
			changeMyRequest: changeMyRequest,
			changeOtherRequest: changeOtherRequest
		}, function(err, results) {
			if (err)
				return res.negotiate(err);
			return res.send(results);
		});

		function changeMyRequest(callback) {
			User.findOne({
					id: userId
				})
				.exec(function(err, result) {
					if (err)
						return callback(err);


					var request = result.myRequestWaiting.splice(index, 1);

					if (typeof result.myRequestApproved !== 'undefined' && result.myRequestApproved.length > 0) {
						myRequestApproved = result.myRequestApproved;
					}

					myRequestApproved.push(request[0]);

					User.update({
							id: userId
						}, {
							myRequestWaiting: result.myRequestWaiting,
							myRequestApproved: myRequestApproved
						})
						.exec(function(err, result) {
							if (err)
								return callback(err);

							callback(null, result);
						})
				});
		}

		function changeOtherRequest(callback) {
			User.findOne({
					id: owner
				})
				.exec(function(err, result) {
					if (err)
						return callback(err);


					var request = result.otherRequestWaiting.splice(index, 1);

					if (typeof result.otherRequestApproved !== 'undefined' && result.otherRequestApproved.length > 0) {
						otherRequestApproved = result.otherRequestApproved;
					}

					otherRequestApproved.push(request[0]);

					User.update({
							id: owner
						}, {
							otherRequestWaiting: result.otherRequestWaiting,
							otherRequestApproved: otherRequestApproved
						})
						.exec(function(err, result) {
							if (err)
								return callback(err);

							callback(null, result);
						})
				});
		}
	},

	deleteRequest: function(req, res) {
		var deleteType = req.param('deleteType');
		var index = req.param('index');
		var userId = req.param('userId');

		User.findOne({
				id: userId
			})
			.exec(function(err, result) {
				if (err)
					return res.negotiate(err);

				if (deleteType === 'myRequestWaiting') {
					result.myRequestWaiting.splice(index, 1);
					updateRequest('myRequestWaiting', result.myRequestWaiting);
				}
				else if (deleteType === 'myRequestApproved') {
					result.myRequestApproved.splice(index, 1);
					updateRequest('myRequestApproved', result.myRequestApproved);
				}
				else if (deleteType === 'otherRequestWaiting') {
					result.otherRequestWaiting.splice(index, 1);
					updateRequest('otherRequestWaiting', result.otherRequestWaiting);
				}
				else {
					result.otherRequestApproved.splice(index, 1);
					updateRequest('otherRequestApproved', result.otherRequestApproved);
				}

				function updateRequest(deleteType, deletedValues) {
					var update = {};
					update[deleteType] = deletedValues;

					User.update({
							id: userId
						}, update)
						.exec(function(err) {
							if (err)
								return res.negotiate(err);
							return res.ok();
						})
				}
			});
	},

	getBooks: function(req, res) {
		var userId = req.param('userId');

		User.findOne({
				id: userId
			})
			.populate('books')
			.exec(function(err, result) {
				if (err)
					return res.negotiate(err);

				return res.send(result);
			});
	},

	getProfile: function(req, res) {
		var userId = req.param('userId');

		User.findOne({
				id: userId
			})
			.exec(function(err, result) {
				if (err)
					return res.negotiate(err);
				return res.send(result);
			});
	},

	login: function(req, res) {
		User.findOne({
			email: req.body.email
		}, function(err, user) {
			if (err)
				return res.negotiate(err);
			if (!user) {
				return res.notFound({
					message: 'Invalid email'
				});
			}
			User.comparePassword(req.body.password, user, function(err, isMatch) {
				if (err)
					return res.negotiate(err);
				if (!isMatch) {
					return res.send(401, {
						message: 'Invalid password'
					});
				}
				res.send({
					token: createJWT(user),
					userId: user.id
				});
			});
		});
	},

	myRequests: function(req, res) {
		var userId = req.param('userId');
		var waiting = [];
		var approved = [];
		var myRequests = {};

		User.findOne({
				id: userId
			})
			.exec(function(err, result) {
				if (err) {
					return res.negotiate(err);
				}

				if (typeof result.myRequestWaiting !== 'undefined' && result.myRequestWaiting.length > 0) {
					waiting = result.myRequestWaiting;
				}

				if (typeof result.myRequestApproved !== 'undefined' && result.myRequestApproved.length > 0) {
					approved = result.myRequestApproved;
				}

				myRequests.waiting = waiting;
				myRequests.approved = approved;

				return res.send(myRequests);
			});
	},

	otherRequests: function(req, res) {
		var userId = req.param('userId');
		var waiting = [];
		var approved = [];
		var otherRequests = {};

		User.findOne({
				id: userId
			})
			.exec(function(err, result) {
				if (err) {
					return res.negotiate(err);
				}

				if (typeof result.otherRequestWaiting !== 'undefined' && result.otherRequestWaiting.length > 0) {
					waiting = result.otherRequestWaiting;
				}

				if (typeof result.otherRequestApproved !== 'undefined' && result.otherRequestApproved.length > 0) {
					approved = result.otherRequestApproved;
				}

				otherRequests.waiting = waiting;
				otherRequests.approved = approved;

				return res.send(otherRequests);
			});
	},

	requestBook: function(req, res) {
		var book = req.allParams();
		var myRequestWaiting = [];
		var otherRequestWaiting = [];

		async.parallel({
			saveMyRequest: saveMyRequest,
			saveOtherRequest: saveOtherRequest
		}, function(err, results) {
			if (err)
				return res.negotiate(err);
			return res.ok();
		});

		function saveMyRequest(callback) {
			User.findOne({
					id: book.userId
				})
				.exec(function(err, result) {
					if (err) {
						return callback(err);
					}

					var requestObj = {
						cover: book.cover,
						userId: book.userId,
						owner: book.owner
					};

					if (typeof result.myRequestWaiting !== 'undefined' && result.myRequestWaiting.length > 0) {
						myRequestWaiting = result.myRequestWaiting;
					}

					myRequestWaiting.push(requestObj);

					User.update({
							id: book.userId
						}, {
							myRequestWaiting: myRequestWaiting
						})
						.exec(function(err, result) {
							if (err) {
								return callback(err);
							}

							callback(null, result);
						});
				});
		}

		function saveOtherRequest(callback) {
			User.findOne({
					id: book.owner
				})
				.exec(function(err, result) {
					if (err) {
						return callback(err);
					}

					var requestObj = {
						cover: book.cover,
						userId: book.userId,
						owner: book.owner
					};

					if (typeof result.otherRequestWaiting !== 'undefined' && result.otherRequestWaiting.length > 0) {
						otherRequestWaiting = result.otherRequestWaiting;
					}

					otherRequestWaiting.push(requestObj);

					User.update({
							id: book.owner
						}, {
							otherRequestWaiting: otherRequestWaiting
						})
						.exec(function(err, result) {
							if (err) {
								return callback(err);
							}

							callback(null, result);
						});
				});
		}
	},

	signup: function(req, res) {
		User.findOne({
			email: req.body.email
		}, function(err, existingUser) {
			if (existingUser) {
				return res.send(409, {
					message: 'Email is already taken'
				});
			}
			var user = {
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			};
			User.create(user, function(err, result) {
				if (err) {
					res.negotiate(err);
				}
				res.send({
					token: createJWT(result),
					userId: result.id
				});
			});
		});
	},

	updatePassword: function(req, res) {
		var params = req.allParams();

		User.findOne({
				id: params.userId
			})
			.exec(function(err, user) {
				if (err)
					return res.negotiate(err);

				if (!user) {
					return res.notFound();
				}
				else {
					User.comparePassword(params.currentPassword, user, function(err, isMatch) {
						if (err)
							return res.negotiate(err);

						if (!isMatch) {
							return res.notFound({
								message: 'Your current password is incorrect!'
							});
						}
						else {
							User.changePassword(params.newPassword, user, function(err, result) {
								if (err)
									return res.negotiate(err);
								return res.ok();
							});
						}
					});
				}
			});
	},

	updateProfile: function(req, res) {
		var params = req.allParams();
		var user = {
			name: params.name,
			city: params.city || '',
			state: params.state || ''
		};

		sails.log(user);

		User.update({
				id: params.userId
			}, {
				name: user.name,
				city: user.city,
				state: user.state
			})
			.exec(function(err, result) {
				if (err)
					return res.negotiate(err);
				return res.ok();
			});
	},

	viewDisplay: function(req, res) {
		var name = req.param('name');
		return res.view('partials/' + name);
	},

	redirectAll: function(req, res) {
		return res.redirect('/');
	}

};

function createJWT(user) {
	var payload = {
		sub: user.id,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};
	return jwt.encode(payload, TOKEN_SECRET);
}