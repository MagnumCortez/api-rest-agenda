import { Schema, model } from 'mongoose'

import mongoosePaginate from 'mongoose-paginate';

const ContatoSchema = new Schema({
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	instituicao: {
		type: String,
		required: true
	},
	birthday: {
		type: Date,
		required: true
	}
}, {
	timestamps: true
});

ContatoSchema.plugin(mongoosePaginate);

export default model('Contato', ContatoSchema);