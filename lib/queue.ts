import { Queue, Worker, Job } from 'bullmq'
import { redis } from './redis'
import { sendEmail } from './email'

// Cast redis as any to satisfy BullMQ's type expectations
export const emailQueue = new Queue('email', { connection: redis as any })

export const startWorker = () => {
  new Worker('email', async (job: Job) => {
    const { to, subject, body } = job.data
    await sendEmail(to, subject, body)
  }, { connection: redis as any })
}