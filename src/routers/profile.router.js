import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/authorization.js';
import bcrypt from 'bcrypt';

const router = express.Router();

//프로필 조회 API
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    // 유저id를 인증 미들웨어에서 가져옵니다.
    const userId = parseInt(req.user.id);
    // 해당 id가 프리즈마 데이터베이스에 등록이 되어있는 id인지 확인합니다
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    // 해당 아이디가 존재하지 않으면 에러메시지를 출력합니다.
    if (!user) {
      return res.status(404).json({ message: '유저가 존재하지 않습니다.' });
    }
    // 유저의 프로필을 데이터에 userProfile 이라는 객체이름에 저장합니다.
    const userProfile = {
      email: user.email,
      nickname: user.nickname,
      password: '**********',
    };
    // 결과를 반환합니다.
    return res
      .status(200)
      .json({ message: '프로필 조회가 완료되었습니다.', data: userProfile });
  } catch (err) {
    next(err);
  }
});

// 프로필 수정 API
router.patch('/profile', authMiddleware, async (req, res, next) => {
  try {
    // 유저id를 인증 미들웨어에서 가져옵니다.
    const userId = parseInt(req.user.id);
    // body 값으로 수정할 부분들을 선정합니다.
    const { password, nickname } = req.body;

    // 해당 id가 프리즈마 데이터베이스에 등록이 되어있는 id인지 확인합니다
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    // 해당 아이디가 존재하지 않으면 에러메시지를 출력합니다.
    if (!user) {
      return res.status(404).json({ message: '유저가 존재하지 않습니다.' });
    }

    // 닉네임 중복 여부를 검사합니다.
    if (nickname && nickname !== user.nickname) {
      const existingUser = await prisma.users.findUnique({
        where: { nickname },
      });

      // 중복 닉네임이 존재하고 그것이 현재 유저가 아니라면 에러 메시지를 반환합니다.
      if (existingUser) {
        return res
          .status(400)
          .json({ message: '이미 사용 중인 닉네임입니다.' });
      }
    }

    // 업데이트 되는 데이터를 담을 객체를 생성
    const updatedData = {
      ...(nickname && { nickname }),
      ...(password && {
        password: await bcrypt.hash(password, parseInt(process.env.SALTNUM)),
      }),
    };

    // 최종 업데이트된 유저를 선언하여 변경된 데이터를 새롭게 할당한다.
    await prisma.users.update({
      where: { id: userId },
      data: updatedData,
    });

    return res.status(201).json({ message: '프로필이 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
});

export default router;
