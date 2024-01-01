import {Context} from 'koa';
import Router from 'koa-router';

import cryptoController from '../controllers/cryptoController';
import devCheck from '../middleware/devOnlyMiddleware';

const router = new Router();

router.get('/getPublicKey', async (ctx: Context) => {
  await cryptoController.getPublicKey(ctx);
});
router.post('/encrypt', devCheck, async (ctx: Context) => {
  await cryptoController.encrypt(ctx);
});
router.post('/decrypt', devCheck, async (ctx: Context) => {
  await cryptoController.decrypt(ctx);
});
router.post('/hashPassword', devCheck, async (ctx: Context) => {
  await cryptoController.hashPasword(ctx);
});
router.post('/checkPassword', devCheck, async (ctx: Context) => {
  await cryptoController.checkPassword(ctx);
});

const authRoutes = router.routes();
export default authRoutes;
