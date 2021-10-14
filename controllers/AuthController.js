import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    const authUser = request.header('Authorization');
    if (!authUser) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const basicAuth = Buffer.from(authUser.replace('Basic', ''), 'base64');
    const eml = basicAuth.toString('utf-8').split(':')[0];
    const pwd = basicAuth.toString('utf-8').split(':')[1];
    const credentials = { email: eml, password: pwd };
    if (!credentials.email || !credentials.password) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    credentials.password = sha1(credentials.password);
    const userCreated = await dbClient.DB.collection('users').findOne(credentials);
    if (!userCreated) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const randToken = uuidv4();
    const keyAuth = `auth_${randToken}`;
    redisClient.set(keyAuth, userCreated._id.toString(), 86400);
    return response.status(200).send({ randToken });
  }

  static async getDisconnect(request, response) {
    const authToken = request.header('X-Token');
    if (!authToken) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const getToken = await redisClient.get(`auth_${authToken}`);
    if (!getToken) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${authToken}`);
    return response.status(204).send();
  }
}

module.exports = AuthController;
