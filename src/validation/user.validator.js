import Joi from 'joi';

const signupSchema = Joi.object({
  email: Joi.string().email().lowercase().min(4).required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  nickname: Joi.string().required(),
});

const userValidator = {
  signupValidation: async (req, res, next) => {
    const validation = signupSchema.validate(req.body);

    if (validation.error) {
      return res.status(400).json({ message: '잘못된 입력입니다.' });
    }

    next();
  },
};

export default userValidator;
