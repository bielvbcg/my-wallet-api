import { Router } from 'express';
import { newEntry, getEntries } from "../controllers/entryController.js"
import validateToken from '../middlewares/validateToken.js';
import validateEntrySchemaMiddleware from '../middlewares/validateEntrySchemaMiddleware.js';

const entryRouter = Router();

entryRouter.post('/entries', validateEntrySchemaMiddleware, validateToken, newEntry);
entryRouter.get("/entries", validateToken, getEntries)
export default entryRouter;