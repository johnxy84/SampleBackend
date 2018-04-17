'use strict';

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const bcrypt = require ('bcrypt');
const config = require ('app/config/config.js')

const UserSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
			trim: true,
		},
		lastname: {
			type: String,
			required: true,
    },
		email: {
				type: String,
				required: true,
		},
		phone: {
				type: String,
				required: true,
		},
		password: {
			type: String,
			required: true
		}
	},
	{ minimize: false }
);

UserSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, 10, function (err, hash){
	  if (err) {
		return next(err);
	  }
	  user.password = hash;
	  next();
	})
  });

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

const User = mongoose.model('User', UserSchema);
module.exports = User;