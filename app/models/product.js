'use strict';

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const bcrypt = require ('bcrypt');
const searchPlugin = require('mongoose-search-plugin');

const ProductSchema = new mongoose.Schema(
	{
		title: {
			
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true
    },
		ownerid: {
				type: String,
				required: true,
		},
		categoryid: {
				type: String,
				required: true,
		},
		categoryname: {
			type: String,
			required: true
		}
	},
	{ minimize: false }
);

ProductSchema.plugin(timestamps);
ProductSchema.plugin(mongooseStringQuery);
ProductSchema.plugin(searchPlugin,  {
    fields: ['title', 'description', 'categoryname']
  });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;