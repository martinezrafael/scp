import { Queue } from 'bullmq';
import { env } from '../../../config/src/env.js';

if (!env.REDIS_URL) {
  throw new Error('REDIS_URL não foi configurada nas variáveis de ambiente.');
}

export const defaultQueue = new Queue('default', {
  connection: {
    url: env.REDIS_URL,
  },
});