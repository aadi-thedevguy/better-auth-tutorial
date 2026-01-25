import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
   return await resend.emails.send({
    from: process.env.EMAIL_FROM!!,
    to,
    subject,
    html,
    text,
  })
}
  // try {
  //   const { data, error } = await resend.emails.send({
  //     from: 'Acme <onboarding@resend.dev>',
  //     to: ['delivered@resend.dev'],
  //     subject: 'Hello world',
  //     react: EmailTemplate({ firstName: 'John' }),
  //   });

  //   if (error) {
  //     return Response.json({ error }, { status: 500 });
  //   }

  //   return Response.json(data);
  // } catch (error) {
  //   return Response.json({ error }, { status: 500 });
  // }

