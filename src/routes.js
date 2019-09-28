import { Router} from 'express';

import ContatoController from './app/controllers/ContatoController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.get('/contacts', ContatoController.index);
routes.post("/contacts", ContatoController.store);
routes.put("/contacts/:id", ContatoController.update);
routes.delete("/contacts/:id", ContatoController.destroy);

export default routes;