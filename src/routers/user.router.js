import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userValid from '../validation/user.validator.js';
import authorization from '../middlewares/authorization.js';
import nodemailer from 'nodemailer';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성.

//이메일 전송 transporter 메일을 전송하는 이메일의 값이 담겨있다.
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // 이메일 서비스 제공자 (예: gmail, naver)
  auth: {
    user: process.env.NODEMAILER_USER, // 발신자 이메일 주소
    pass: process.env.NODEMAILER_PASS, // 발신자 이메일 비밀번호 또는 앱 비밀번호
  },
});

// 계정 생성 API
router.post('/signUp', userValid.signupValidation, async (req, res, next) => {
  const { email, password, nickname } = req.body;

  //랜덤코드 생성 함수
  function randomCode() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      //랜덤한 인덱스의 유니코드 단일문자반환
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
  //인증 번호 생성 및 변수 할당
  const verificationCode = randomCode();

  //메일 형태 설정
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    //가입 이메일
    to: email,
    subject: '이메일 인증을 완료해주세요',
    html: `인증 코드는 ${verificationCode} 입니다.`,
  };

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
    //비밀번호 해쉬
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALTNUM),
    );

    //메일 보내기
    await transporter.sendMail(mailOptions);

    await prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        nickname: nickname,
        emailVerify: false,
        verificationCode: verificationCode,
      },
    });

    return res.status(201).json({
      message:
        '회원등록 되었습니다. 이메일 인증을 완료하시면 가입이 완료됩니다.',
    });
  } catch (err) {
    next(err);
  }
});

//이메일 인증 API
router.post('/email-verify', async (req, res, next) => {
  const { verificationCode, email } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (user.emailVerify) {
      return res.status(400).json({ message: '이미 인증된 이메일입니다.' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: '잘못된 인증 코드입니다.' });
    }

    // 이메일 인증 완료 처리
    await prisma.users.update({
      where: { email },
      data: { emailVerify: true, verificationCode: null },
    });

    return res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
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

    if (!user.emailVerify) {
      return res
        .status(401)
        .json({ message: '이메일 인증이 완료되지 않았습니다.' });
    }

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
