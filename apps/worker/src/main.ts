import { Worker } from 'bullmq';
import { env } from '../../../packages/config/src/env.js';

if (!env.REDIS_URL) {
  throw new Error('REDIS_URL não foi configurada nas variáveis de ambiente.');
}

new Worker(
  'default',
  async (job) => {
    console.log(`[Job Processado] ID: ${job.id} | Nome: ${job.name}`, job.data);
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
  },
);