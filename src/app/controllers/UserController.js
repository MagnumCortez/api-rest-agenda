import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async index(req, res) {
		const { page = 1, limit = 9999 } = req.query;

		const users = await User.paginate({}, { page, limit: parseInt(limit) });

		return res.json(users);
    }
    
    async store(req, res) {
        const schema = Yup.object().shape({
            login: Yup.string().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const userExists = await User.findOne({ login: req.body.login });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const { id, login } = await User.create(req.body);

        return res.json({ id, login });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            login: Yup.string(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { login, oldPassword } = req.body;

        const user = await User.findById(req.userId);

        if (login !== user.login) {
            const userExists = await User.findOne({ login });

            if (userExists) {
                return res.status(400).json({ error: 'Login already exists.' });
            }
        }

        if (oldPassword !== user.password) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id } = await User.update(req.body);

        return res.json({
            id,
            login
        });
    }
}

export default new UserController();