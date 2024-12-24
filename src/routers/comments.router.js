import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleWare from '../middlewares/authrization.js';
import * as commentMiddleWare from '../validation/comments.validator.js';

const router = express.Router();

// 댓글 작성
router.post(
  '/posts/:postId/comments',
  authMiddleWare,
  commentMiddleWare.checkAddComment,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body.user;
      const { content } = req.body;

      const addComment = await prisma.comments.create({
        data: {
          postId: +postId,
          userId: +userId,
          content,
        },
      });
      return res.status(201).json({
        message: '댓글을 작성하였습니다.',
      });
    } catch (err) {
      next(err);
    }
  },
);

// 댓글 조회
router.get(
  '/posts/:postId/comments',
  authMiddleWare,
  commentMiddleWare.checkLookUpComments,
  async (req, res, next) => {
    try {
      const { postId } = req.params;

      const lookUpComment = await prisma.comments.findMany({
        where: { postId: +postId },
        select: {
          userId: true,
          content: true,
          createdAt: true,
        },
      });
      return res.status(200).json({ lookUpComment });
    } catch (err) {
      next(err);
    }
  },
);

// 댓글 수정
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleWare,
  commentMiddleWare.checkChangeComment,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      const changeComment = await prisma.comments.update({
        where: { id: commentId },
        data: { content },
      });
      return res.status(201).json({
        message: '댓글을 수정하였습니다.',
      });
    } catch (error) {
      next(err);
    }
  },
);

export default router;