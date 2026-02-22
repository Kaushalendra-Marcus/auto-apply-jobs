import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({ region: process.env.AWS_REGION })

export async function sendEmail(to: string, subject: string, body: string) {
  const command = new SendEmailCommand({
    Source: process.env.EMAIL_FROM!,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: body } },
    },
  })
  await ses.send(command)
}   