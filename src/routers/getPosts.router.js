import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

router.get('/posts/mobile', async (req, res, next) => {
  try {
    const mobilePosts = await prisma.posts.findMany({
      where: { type: 'mobile' },
      select: {
        title: true,
        content: true,
        createdAt: true,
        type: true,
        Users: {
          select: {
            nickname: true,
          },
        },
        // 포스트 아이디와 같은 좋아요의 개수를 출력하고 싶다.
        // 좋아요 테이블에 1번게시글이 들어간 개수가 10개라면
        _count: {
          select: {
            Like: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    if (mobilePosts.length === 0) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    const formattedPosts = mobilePosts.map((post) => ({
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      nickname: post.Users.nickname,
      type: post.type,
      likes: post._count.Like,
    }));

    return res
      .status(200)
      .json({ message: '게시글 조회가 완료되었습니다.', data: formattedPosts });
  } catch (err) {
    next(err);
  }
});

export default router;
