import mongoose from 'mongoose';
import env from '../utils/env.js';

const initMongoConnection = async () => {
  try {
    const URI = env('MONGO_URI');
    
    await mongoose.connect(URI);
    
    console.log('Mongo connection successfully established');
  } catch (e) {
    console.log('Error while setting up Mongo connection', e);
    throw e;
  }
};

export default initMongoConnection;