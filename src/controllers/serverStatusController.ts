import { Context } from "koa"

class ServerController {
  public async statusCheck(ctx: Context) {
    ctx.body = {
        status: 'OK'
    }
  }
}

export default new ServerController()