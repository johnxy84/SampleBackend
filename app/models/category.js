'use strict';

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ minimize: false }
);

CategorySchema.plugin(timestamps);
CategorySchema.plugin(mongooseStringQuery);

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;