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

const app = express();
const PORT = 3030;

dotenv.config();
app.use(express.json());
app.use(cookieParser());
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

// 정적 파일 제공
app.use(express.static('src/public'));

// HTML 파일 제공
app.get('/', (req, res) => {
  res.sendFile('views/index.html', { root: 'src' });
});

app.get('/login', (req, res) => {
  res.sendFile('views/login.html', { root: 'src' });
});

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
