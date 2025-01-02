import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authorization from '../middlewares/authorization.js';
import uploader from '../middlewares/s3upload.js'; // 1

const router = express.Router();

/** 게시글 생성 API **/
router.post(
  '/posts',
  authorization,
  uploader.single('media'), //멀터 미들웨어 // 2
  async (req, res, next) => {
    const userId = parseInt(req.user.id);
    const { title, content, type } = req.body;
    const now = Date.now();
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const koreaNow = now + koreaTimeDiff;
    const mediaUrl = req.file ? req.file.location : null;

    try {
      const post = await prisma.posts.create({
        data: {
          userId: userId,
          title: title,
          content: content,
          createdAt: new Date(koreaNow),
          type: type,
          media: mediaUrl,
        },
      });

      return res.status(201).json({ data: post });
    } catch (err) {
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  },
);

// 게시물 수정
router.patch('/posts/:postId', authorization, async (req, res, next) => {
  const { postId } = req.params;
  const userId = parseInt(req.user.id);
  const { title, content, type } = req.body;

  try {
    // 게시글이 존재하는지 확인
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    if (userId !== post.userId) {
      return res.status(404).json({ message: '게시글 작성자가 아닙니다.' });
    }
    // 게시글 수정
    const updatedPost = await prisma.posts.update({
      where: { id: parseInt(postId) },
      data: { title, content, type },
    });

    return res
      .status(200)
      .json({ message: '게시글이 수정되었습니다.', data: updatedPost });
  } catch (err) {
    // 다른 오류 처리
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/** 내게시글 조회 API **/
router.get('/posts', authorization, async (req, res) => {
  // 사용자의 ID를 인증 미들웨어에서 가져옵니다.
  const userId = req.user.id; // req.user는 미들웨어에서 설정된 사용자 정보

  try {
    // 현재 로그인한 사용자의 게시물 조회
    const posts = await prisma.posts.findMany({
      where: {
        userId: userId, // 현재 로그인한 사용자의 ID로 게시물 조회
      },
      select: {
        title: true,
        createdAt: true,
        content: true,
        type: true,
        Users: {
          select: {
            nickname: true,
          },
        },
        _count: {
          // _count를 Users와 같은 레벨로 이동
          select: {
            Like: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 게시물이 없을 경우
    if (posts.length === 0) {
      return res.status(404).json({ message: '게시물이 없습니다.' });
    }

    // 게시물 목록 반환
    return res.status(200).json({ data: posts });
  } catch (err) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

//검증 로직 필요할듯?
/** 게시글 삭제 API **/
router.delete('/posts/:postId', authorization, async (req, res) => {
  const { postId } = req.params;
  const userId = parseInt(req.user.id);

  try {
    // 게시글이 존재하는지 확인
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    if (userId !== post.userId) {
      return res.status(404).json({ message: '게시글 작성자가 아닙니다.' });
    }

    // 게시글 삭제
    const deletedPost = await prisma.posts.delete({
      where: { id: +postId },
    });

    return res
      .status(200)
      .json({ message: '게시글이 삭제되었습니다.', data: deletedPost });
  } catch (err) {
    // 다른 오류 처리
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
