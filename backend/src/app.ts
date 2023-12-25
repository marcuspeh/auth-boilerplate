import cookieParser from 'koa-cookie';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Cors from '@koa/cors';

import routes from './routes/index';
import apiKeyCheck from './middleware/apiKeyMiddleware';

const app: Koa = new Koa();

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error: any) {
    ctx.status = error.statusCode || error.status || 500;
    error.status = ctx.status;
    ctx.body = {error};
    ctx.app.emit('error', error, ctx);
  }
});

// Middleware
app.use(Cors({credentials: true}));
app.use(apiKeyCheck);
app.use(cookieParser());
app.use(bodyParser());
app.proxy = true;

app.use(routes.routes());
app.use(routes.allowedMethods());

// Application error logging.
app.on('error', console.error);

export default app;
