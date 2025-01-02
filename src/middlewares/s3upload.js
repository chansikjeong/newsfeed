import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import path from 'path';
import multer from 'multer';

const s3 = new aws.S3({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
}); // 지역과 접근키, 비밀키를 발급 받는다.

export const uploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET, // S3 버킷 이름 // 버켓에 업로드할 파일을 담는다
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      // 파일 이름 설정
      const extension = path.extname(file.originalname);
      callback(null, `posts/${Date.now()}-${Math.random() * 1000}${extension}`); //동일 파일명도 겹치지 않게
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
}); //  멀터를 이용해서 업로더라는 로직을 선언하는데 s3를 사용하기 위해 스토리지에 적고

export const profileUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET, // S3 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      // 파일 이름 설정
      const extension = path.extname(file.originalname);
      callback(
        null,
        `profiles/${Date.now()}-${Math.random() * 1000}${extension}`,
      ); //동일 파일명도 겹치지 않게
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploader;
