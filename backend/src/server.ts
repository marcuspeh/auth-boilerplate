require('dotenv').config();

import app from './app';
import {dataSource} from './data-source';
import logger from './middleware/logger';

dataSource
  .initialize()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port);
    logger.info(`Server listening on port ${port}`);
  })
  .catch(console.error);
