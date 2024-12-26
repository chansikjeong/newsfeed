import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

/** 좋아요 꾸욱 **/
router.post('/post/:postId/like', authorization, async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const { postId } = req.params;
  try {
    //해당 유저가 이미 이 글에 좋아요를 눌렀는지 판단
    const myLike = checkLike(postId, userId);
    //안 눌렀으면 좋아요 데이터 생성
    if (!myLike) {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return res
          .status(201)
          .json({ message: '좋아요!' });
    }
  } catch (err) {
    next(err);
  }
});

/** 취소 **/
router.delete('/post/:postId/like', authorization, async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const { postId } = req.params;
  try {
    //해당 유저가 이미 이 글에 좋아요를 눌렀는지 판단
    const myLike = checkLike(postId, userId);
    //눌렀으면 좋아요 데이터 삭제
    if (myLike) {
      await prisma.like.delete({
        data: {
          postId,
          userId,
        },
      });
      return res
          .status(200)
          .json({ message: '사실 안 좋아요.' });
    }
  } catch (err) {
    next(err);
  }
});

/** 해당 좋아요를 찾는 함수, 오류 확인 필요 **/
async function checkLike(pId, uId) {
  return await prisma.like.findFirst({
    where: {
      postId: parseInt(pId),
      userId: parseInt(uId),
    },
  });
}

export default router;
