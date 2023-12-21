import Router from 'koa-router';
import {Context} from 'koa';
import userController from '../controllers/userController';
import auth from '../middleware/authMiddleware';

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

const userRoutes = router.routes();
export default userRoutes;
