import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userValid from '../validation/user.validator.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성.

// 계정 생성 API
router.post('/signUp', userValid.signupValidation, async (req, res, next) => {
  const { email, password, nickname } = req.body;
  try {
    const sameEmail = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    // 사용자 정보가 이미 존재하는 경우
    if (sameEmail) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const sameName = await prisma.users.findUnique({
      where: {
        nickname,
      },
    });
    if (sameName) {
      return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALTNUM),
    );

    await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        nickname: nickname,
      },
    });

    return res.status(201).json({ message: '회원가입 되었습니다.' });
  } catch (err) {
    next(err);
  }
});

//로그인 API
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    if (!email) throw new Error('없는 유저입니다');

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });
    res.setHeader('authorization', 'Bearer ' + token);

    return res.status(200).json({ message: '로그인 하였습니다.' });
  } catch (err) {
    next(err);
  }
});

export default router;
