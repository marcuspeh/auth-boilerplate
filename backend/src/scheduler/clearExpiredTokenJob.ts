import {CronJob} from 'cron';
import TokenService from '../services/tokenService';

const clearExpiredTokenJob = new CronJob(
  '0 * * * * *', // cronTime
  () => {
    console.log('Invalidating expired tokens');
    const tokenService: TokenService = new TokenService();
    tokenService.invalidateExpiredToken();
  }, // onTick
  null, // onComplete
  true // start
);

export default clearExpiredTokenJob;
