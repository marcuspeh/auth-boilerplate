import {CronJob} from 'cron';

import TokenService from '../services/tokenService';

const clearExpiredTokenJob = new CronJob(
  '0 * * * * *', //y cronTime
  () => {
    console.log('Invalidating expired tokens');
    TokenService.invalidateExpiredToken();
  }, // onTick
  null, // onComplete
  true // start
);

export default clearExpiredTokenJob;
