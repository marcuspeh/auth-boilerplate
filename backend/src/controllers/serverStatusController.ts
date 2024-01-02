import {Context} from 'koa';

async function statusCheck(ctx: Context) {
  ctx.body = {
    status: 'OK',
  };
}

export default {
  statusCheck,
};
