import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routers/user.router.js';
import commentRouter from './routers/comments.router.js';
import profileRouter from './routers/profile.router.js';
import getPostRouter from './routers/getPosts.router.js';
import postRouter from './routers/post.router.js';
import likeRouter from './routers/like.router.js';
import errorHandlermiddleware from './middlewares/errorHandler.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/api', [
  userRouter,
  profileRouter,
  getPostRouter,
  postRouter,
  commentRouter,
  likeRouter,
]);
app.use(errorHandlermiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
