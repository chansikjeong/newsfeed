import { prisma } from '../utils/prisma/index.js';

// 댓글 작성 검증
export async function checkAddComment(req, res, next) {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // 해당 id의 글이 존재하는 지
    const postIdExist = await prisma.posts.findUnique({
      where: { Id: +postId },
    });
    if (!postIdExist) throw new Error(`해당 글이 존재하지 않습니다.`);
    if (!content) throw new Error(`댓글 내용을 입력해 주세요.`);

    next();
  } catch {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 댓글 조회 검증
export async function checkLookUpComments(req, res, next) {
  try {
    const { postId } = req.params;

    // 해당 id의 글이 존재하는 지
    const postIdExist = await prisma.posts.findUnique({
      where: { Id: +postId },
    });
    if (!postIdExist) throw new Error(`해당 글이 존재하지 않습니다.`);

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}

// 댓글 수정 검증
export async function checkChangeComment(req, res, next) {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body.user;
    const { content } = req.body;

    const postIdExist = await prisma.posts.findUnique({
      where: { Id: +postId },
    });
    if (!postIdExist) throw new Error(`해당 글이 존재하지 않습니다.`);

    const commentIdExist = await prisma.comments.findUnique({
      where: { id: +commentId },
      select: {
        userId: true,
      },
    });
    if (!commentIdExist) throw new Error(`해당 댓글이 존재하지 않습니다.`);
    if (commentIdExist !== userId)
      throw new Error(`해당 댓글을 수정 할 권한이 없습니다`);
    if (!content) throw new Error(`수정할 댓글 내용을 입력해 주세요.`);

    next();
  } catch (err) {
    return res.status(400).json({ errormessage: err.message });
  }
}
