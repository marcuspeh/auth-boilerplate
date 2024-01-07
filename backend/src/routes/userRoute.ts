import {Context} from 'koa';
import Router from 'koa-router';

import auth from '../middleware/authMiddleware';
import userController from '../controllers/userController';

const router = new Router();

router.post('/register', async (ctx: Context) => {
  await userController.register(ctx);
});
router.post('/login', async (ctx: Context) => {
  await userController.login(ctx);
});
router.post('/logout', auth, async (ctx: Context) => {
  await userController.logout(ctx);
});
router.post('/updatePassword', auth, async (ctx: Context) => {
  await userController.updatePassword(ctx);
});
router.get('/checkAuth', auth, async (ctx: Context) => {
  await userController.checkAuthentication(ctx);
});

const userRoutes = router.routes();
export default userRoutes;
