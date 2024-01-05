import {Context} from 'koa';

import serverStatusController from './serverStatusController';

describe('statusCheck', () => {
  it('valid', async () => {
    const expectedBody = {
      status: 'OK',
    };

    const context: unknown = {};
    await serverStatusController.statusCheck(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);
  });
});
