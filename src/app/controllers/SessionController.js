import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { login, password } = req.body;

    const userExists = await User.findOne({ login });
    
    if (!userExists || (password !== userExists.password)) {
      return res.status(401).json({ error: 'User or password doesnt match' });
    }

    const { id, name } = userExists;

    return res.json({
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, 'appkey-posgraduacao-agenda-api', {
        expiresIn: '1h',
      }),
    });
  }
}

export default new SessionController();
