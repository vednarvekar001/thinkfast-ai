import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to DB', error);
    process.exit(1);
  });
