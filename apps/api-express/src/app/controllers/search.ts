import * as express from 'express';
import { findQueryResults } from '../daos';

const router = express.Router();

/**
 * Search the database for correlated paragraphs
 * @query q - query string
 */
router.get(
  '/',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const query = req.query.q as string;
    const results = await findQueryResults(query);
    res.status(200).json(results);
  }
);

export default router;
