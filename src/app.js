import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routers/user.router.js';

const app = express();
const PORT = 3000;

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', [userRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
