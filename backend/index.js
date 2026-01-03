import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import moodRouter from './routes/mood.route.js';
import journalRouter from './routes/journal.route.js';
import adminRouter from './routes/admin.route.js';
import announcementRouter from './routes/announcement.route.js';
import quoteRouter from './routes/quote.route.js';
import connectDB from './lib/connectDB.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/moods', moodRouter);
app.use('/api/journals', journalRouter);
app.use('/api/admin', adminRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/quotes', quoteRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running ");
});
