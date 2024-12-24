import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

//좋아요 꾸욱
router.post('/api/post/:postId/like', async (req, res, next) => {
  const { postId, userId } = req.params;
  try {
  } catch (e) {
    next(e);
  }
});
