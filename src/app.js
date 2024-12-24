import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routers/user.router.js';
import commentRouter from './routers/comments.router.js';

const app = express();
const PORT = 3000;

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', [userRouter, commentRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
