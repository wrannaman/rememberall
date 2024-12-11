import { Queue } from 'bullmq';
import dotenv from 'dotenv';
import IORedis from 'ioredis';

dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_PREFIX,
} = process.env

const connection = new IORedis({
  host: REDIS_HOST || 'localhost',
  port: parseInt(REDIS_PORT || '6379'),
  maxRetriesPerRequest: null  // Required by BullMQ
});

const mediaIngestQueue = new Queue('media_processing', { connection });

// setInterval(() => {
//   console.log('added job to mediaIngestQueue');
//   mediaIngestQueue.add('media', { ProjectId: 'f4ddba62-929b-49f9-ae43-e707ef0744b7' });
// }, 1000)

/* 

mediaIngestQueue.add({ ProjectId: 'xxx-xxx-xxx' });

mediaIngestQueue.process(function (job, done) {
  // transcode image asynchronously and report progress
  job.progress(42);

  // call done when finished
  done();

  // or give a error if error
  done(new Error("error transcoding"));

  // or pass it a result
  done(null, { width: 1280, height: 720 etc... });

  // If the job throws an unhandled exception it is also handled correctly
  throw new Error("some unexpected error");
});

*/


const queues = {
  mediaIngestQueue
}

export default queues;