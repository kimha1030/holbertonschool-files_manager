import { Router, json } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = (app) => {
  const route = Router();
  app.use(json());
  app.use('/', route);
  route.get('/status', (request, response) => AppController.getStatus(response));
  route.get('/stats', (request, response) => AppController.getStats(response));
  route.post('/users', (request, response) => UsersController.postNew(request, response));
  route.get('/connect', (request, response) => AuthController.getConnect(request, response));
  route.get('/disconnect', (request, response) => AuthController.getDisconnect(request, response));
  route.get('/users/me', (request, response) => UsersController.getMe(request, response));
};

export default router;
