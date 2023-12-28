import {CronJob} from 'cron';

console.log('Before job instantiation');
const clearExpiredTokenJob = new CronJob(
  '* * * * * *', // cronTime
  () => {
    console.log('You will see this message every second');
  }, // onTick
  null, // onComplete
  true // start
);

console.log('After job instantiation');

export default clearExpiredTokenJob;
