import {Context} from 'koa';
import Router from 'koa-router';

import cryptoRoutes from './cryptoRoute';
import serverStatusController from '../controllers/serverStatusController';
import userRoutes from './userRoute';

const router = new Router();
router.prefix('/api');

// Check server status
router.get('/serverStatus', async (ctx: Context) => {
  await serverStatusController.statusCheck(ctx);
});

// Set up routes
router.use('/crypto', cryptoRoutes);
router.use('/auth', userRoutes);

export default router;
