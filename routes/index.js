import { Router, json } from 'express';
import AppController from '../controllers/AppController';

const router = (app) => {
  const route = Router();
  app.use(json());
  app.use('/', route);
  route.get('/status', (request, response) => AppController.getStatus(response));
  route.get('/stats', (request, response) => AppController.getStats(response));
};

export default router;
