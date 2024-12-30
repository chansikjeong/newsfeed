export default function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ errorMessage: err.message });
  } else if (err.code === 'P2025') {
    return res.status(404).json({ message: '좋아요 누르지 않은 글 입니다.' });
  }
  console.log(err);
  return res
    .status(500)
    .json({ errorMessage: '서버에서 에러가 발생하였습니다.' });
}
