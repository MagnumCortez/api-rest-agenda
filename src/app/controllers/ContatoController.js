import * as Yup from 'yup';

import Contato from '../models/Contato';

const getFilters = (params) => {
	let filter = {};

	if (! params || typeof params === undefined) {
		return filter;
	}

	if (params.first_name) {
		filter.first_name = params.first_name;
	}

	if (params.last_name) {
		filter.last_name = params.last_name;
	}

	if (params.email) {
		filter.email = params.email;
	}

	if (params.instituicao) {
		filter.instituicao = params.instituicao;
	}

	if (params.birthday) {
		filter.birthday = params.birthday;
	}

	return filter;
}

class ContatoController {
	async index(req, res) {
		const { page = 1, limit = 9999 } = req.query;

		const filters = getFilters(req.query);

		const contacts = await Contato.paginate(filters, { page, limit: parseInt(limit) });

		return res.json(contacts);
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			first_name: Yup.string().required(),
			last_name: Yup.string().required(),
            email: Yup.string().email().required(),
			instituicao: Yup.string().required(),
			birthday: Yup.date().required()
		});

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
		}

		const contactExist = await Contato.findOne({ 
			first_name: req.body.first_name, 
			last_name: req.body.last_name 
		});

		if (contactExist) {
			return res.status(400).json({ error: 'Contact already exist' });
		}

		const contact = await Contato.create(req.body);

		return res.json(contact);
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			id: Yup.string().required()		
		});

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Validation fails' });
		}

		const contactExist = await Contato.findById(req.params.id);

		if (!contactExist) {
			return res.status(400).json({ error: 'Contact doesn´t exist' });
		}

		const contact = await Contato.findByIdAndUpdate(contactExist.id, req.body, { new : true });

		return res.json(contact);
	}

	async destroy(req, res) {
		const schema = Yup.object().shape({
			id: Yup.string().required()		
		});

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Validation fails' });
		}

		const contactExist = await Contato.findById(req.params.id);

		if (!contactExist) {
			return res.status(400).json({ error: 'Contact doesn´t exist' });
		}

		await Contato.findByIdAndRemove(contactExist.id);

		return res.json({ success: true, message: "Contact has been removed."});
	}
}

export default new ContatoController;