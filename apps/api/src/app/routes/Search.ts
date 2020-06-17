import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '../shared/constants';
import { getQueryResult } from '../daos';

// Init shared
const router = Router();

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

/**
 * @query query - query to be searched
 */
router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const ret = await getQueryResult(query);
  return res.status(OK).json({results: ret});
});

export default router;
