import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
//import authrization from '../middlewares/authrization.js';

const router = express.Router();

/** 좋아요 꾸욱 **/
router.post('/api/post/:postId/like', async (req, res, next) => {
  const { postId, userId } = req.params;
  try {
    //해당 유저가 이미 이 글에 좋아요를 눌렀는지 판단
    const myLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });
    //안 눌렀으면 좋아요 데이터 생성
    if (!myLike) {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
    //눌렀으면 좋아요 취소? 별도로 만들까?
    else {
    }
  } catch (e) {
    next(e);
  }
});
