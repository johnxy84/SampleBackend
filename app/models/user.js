'use strict';

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

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
            type: Number,
            required: true,
		},
		password: {
			type: String,
			required: true
		}
	},
	{ minimize: false }
);

UserSchema.pre('save', (next) => {
	var user = this;
	bcrypt.hash(user.password, 10, function (err, hash){
	  if (err) {
		return next(err);
	  }
	  user.password = hash;
	  next();
	})
  });

UserSchema.methods.isValidPassword = (password) => {
	bcrypt.compare(data.password, user.password, function (err, result) {
		return result === true;
	  });
};

UserSchema.methods.generateToken = ()=>{
	var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); //TODO: Change Secret Value
};

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

const User = mongoose.model('User', UserSchema);
module.exports = User;