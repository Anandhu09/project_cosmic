import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || '5000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/cosmic_insights',
  NASA_API_KEY: process.env.NASA_API_KEY || '',
};