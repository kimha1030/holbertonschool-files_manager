import { MongoClient } from 'mongodb';

// Environmental variables
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, (err, client) => {
      if (!err) {
        this.DB = client.db(database);
      } else {
        this.DB = false;
      }
    });
  }

  isAlive() {
    if (this.DB) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    const users = await this.DB.collection('users').countDocuments();
    return users;
  }

  async nbFiles() {
    const files = await this.DB.collection('files').countDocuments();
    return files;
  }
}

const dbClient = new DBClient();
export default dbClient;
