import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

/** 해당 좋아요를 찾는 함수, 오류 확인 필요 **/
async function checkLike(pId, uId) {
  const checkWriter = await prisma.posts.findFirst({
    where: {
      id: parseInt(pId),
    },
    select: {
      userId: true,
    },
  });

  if (checkWriter.userId == uId) {
    return 'selfLike';
  }

  const myLike = await prisma.like.findFirst({
    where: {
      postId: parseInt(pId),
      userId: parseInt(uId),
    },
  });
  return myLike;
}

/** 좋아요 꾸욱 **/
router.post('/post/:postId/like', authorization, async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const postId = parseInt(req.params.postId);
  try {
    //해당 유저가 이미 이 글에 좋아요를 눌렀는지 판단
    //안 눌렀으면 좋아요 데이터 생성
    const check = await checkLike(postId, userId);

    if (check === 'selfLike') {
      return res.status(405).json({ message: '셀프 좋아요 ㄴㄴ' });
    } else if (!check) {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return res.status(201).json({ message: '좋아요!' });
    }
    return res.status(405).json({ message: '이미 좋아요 누른 글 입니다' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/** 취소 **/
router.delete('/post/:postId/like', authorization, async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const postId = parseInt(req.params.postId);
  try {
    //해당 유저가 이미 이 글에 좋아요를 눌렀는지 판단
    //눌렀으면 좋아요 데이터 삭제
    if (checkLike(postId, userId)) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      return res.status(200).json({ message: '사실 안 좋아요.' });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
