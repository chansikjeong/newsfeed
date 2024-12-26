import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userValid from '../validation/user.validator.js';
import authorization from '../middlewares/authorization.js';

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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({ message: '로그인 하였습니다.' });
  } catch (err) {
    next(err);
  }
});

//로그아웃 API
router.post('/logout', authorization, (req, res, next) => {
  try {
    // 쿠키에 저장된 JWT 토큰 삭제
    res.clearCookie('token');

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '로그아웃 실패' });
  }
});

//회원삭제 API
router.delete('/user-del', authorization, async (req, res, next) => {
  const { password } = req.body;
  const userId = parseInt(req.user.id);
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: '유저가 존재하지 않습니다.' });
    }
    //패스워드 체크
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }
    await prisma.users.delete({ where: { id: userId } });
    return res.status(200).json({ message: '회원탈퇴를 완료했습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '회원탈퇴에 실패하였습니다.' });
  }
});

export default router;
