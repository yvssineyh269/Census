import VerifyEmail from '@/components/email/verify-email';
import { resend } from '@/lib/resend';


export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Census by Next Step <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: VerifyEmail({username: 'John Doe', verifyUrl: 'https://example.com/verify'}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}