// src/routes/posts.router.js

import express from 'express';

const router = express.Router();

/** 게시글 생성 API **/
router.post('/api/posts', async (req, res) => {
  const { userId } = req.user;
  const { title, content, type } = req.body;

  const post = await prisma.posts.create({
    data: {
      userId: +userId,
      title: title,
      content: content,
      type: type,
    },
  });

  return res.status(201).json({ data: post });
});

// 게시물 수정
router.patch('/api/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    // 게시글이 존재하는지 확인
    const post = await prisma.posts.findUnique({
      where: { email: +postId },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 게시글 수정
    const updatedPost = await prisma.posts.update({
      where: { email: +postId },
      data: { title, content },
    });

    return res
      .status(200)
      .json({ message: '게시글이 수정되었습니다.', data: updatedPost });
  } catch (error) {
    // 다른 오류 처리
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// src/routes/posts.router.js

/** 내게시글 조회 API **/
router.get('/api/posts', async (req, res) => {
  // 사용자의 ID를 인증 미들웨어에서 가져옵니다.
  const userId = req.user.id; // req.user는 미들웨어에서 설정된 사용자 정보

  try {
    // 현재 로그인한 사용자의 게시물 조회
    const posts = await prisma.posts.findMany({
      where: {
        userId: userId, // 현재 로그인한 사용자의 ID로 게시물 조회
      },
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
        type: true,
      },
    });

    // 게시물이 없을 경우
    if (posts.length === 0) {
      return res.status(404).json({ message: '게시물이 없습니다.' });
    }

    // 게시물 목록 반환
    return res.status(200).json({ data: posts });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// src/routes/posts.router.js

/** 게시글 삭제 API **/
router.delete('/api/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    // 게시글이 존재하는지 확인
    const post = await prisma.posts.findUnique({
      where: { email: +postId },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 게시글 삭제
    const deletedPost = await prisma.posts.delete({
      where: { email: +postId },
    });

    return res
      .status(200)
      .json({ message: '게시글이 삭제되었습니다.', data: deletedPost });
  } catch (error) {
    // 다른 오류 처리
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
