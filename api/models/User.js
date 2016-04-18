/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 30
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 3,
      required: true
    },
    city: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    myRequestWaiting: {
      type: 'array'
    },
    myRequestApproved: {
      type: 'array'
    },
    otherRequestWaiting: {
      type: 'array'
    },
    otherRequestApproved: {
      type: 'array'
    },
    books: {
      collection: 'book',
      via: 'owner'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  comparePassword: function(password, user, cb) {
    bcrypt.compare(password, user.password, function(err, isMatch) {
      cb(err, isMatch);
    });
  },

  changePassword: function(newPassword, user, cb) {
    user.newPassword = newPassword;
    user.save(function(err, u) {
      return cb(err, u);
    });
  },

  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        }
        else {
          user.password = hash;
          cb();
        }
      });
    });
  },

  beforeUpdate: function(attrs, cb) {
    if (attrs.newPassword) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return cb(err);

        bcrypt.hash(attrs.newPassword, salt, function(err, crypted) {
          if (err) return cb(err);

          delete attrs.newPassword;
          attrs.password = crypted;
          return cb();
        });
      });
    }
    else {
      return cb();
    }
  }
};
