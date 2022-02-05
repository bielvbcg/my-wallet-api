import { Router } from 'express';
import signUpRouter from './signUpRouter.js';
import loginRouter from './loginRouter.js'
import entryRouter from './entriesRouter.js';

const router = Router();
router.use(loginRouter);
router.use(signUpRouter);
router.use(entryRouter);

export default router;