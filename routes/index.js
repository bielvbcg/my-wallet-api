import { Router } from 'express';
import signUpRouter from './signUpRouter.js';
import loginRouter from './loginRouter.js'

const router = Router();
router.use(loginRouter);
router.use(signUpRouter);

export default router;