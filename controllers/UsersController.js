import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email) {
      return response.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).send({ error: 'Missing password' });
    }
    const emailCreated = await dbClient.DB.collection('users').findOne({ email: `${email}` });
    if (emailCreated) {
      return response.status(400).send({ error: 'Already exist' });
    }
    const pHashed = sha1(password);
    const res = await dbClient.DB.collection('users').insertOne({ email: `${email}`, password: `${pHashed}` });
    return response.status(201).send({ id: res.insertedId, email: `${email}` });
  }

  static async getMe(request, response) {
    const authToken = request.header('X-Token');
    if (!authToken) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const getToken = await redisClient.get(`auth_${authToken}`);
    if (!getToken) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const getDoc = await dbClient.DB.collection('users').findOne({ _id: ObjectId(getToken) });
    if (!getDoc) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    return response.status(200).send({ id: getDoc._id, email: getDoc.email });
  }
}

module.exports = UsersController;
