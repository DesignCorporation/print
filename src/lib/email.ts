import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || 'orders@print.designcorp.eu';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@designcorp.eu';

type EmailResult = { success: boolean; error?: string };

async function safeSend(params: { to: string | string[]; subject: string; html: string }): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured, skip email send');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send failed', error);
    return { success: false, error: 'Email send failed' };
  }
}

export async function sendWelcomeEmail(to: string, name?: string) {
  return safeSend({
    to,
    subject: 'Добро пожаловать в Print DesignCorp',
    html: `
      <h1>Привет${name ? `, ${name}` : ''}!</h1>
      <p>Спасибо за регистрацию в Print DesignCorp.</p>
    `,
  });
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string) {
  return safeSend({
    to,
    subject: `Заказ ${orderNumber} принят`,
    html: `
      <h1>Спасибо за заказ!</h1>
      <p>Мы приняли ваш заказ <strong>${orderNumber}</strong> и приступили к обработке.</p>
      <p>Отследить заказ можно в личном кабинете.</p>
    `,
  });
}

export async function sendOrderNotificationToAdmin(orderNumber: string, customerEmail: string) {
  return safeSend({
    to: adminEmail,
    subject: `Новый заказ ${orderNumber}`,
    html: `
      <h1>Новый заказ</h1>
      <p>Номер: <strong>${orderNumber}</strong></p>
      <p>Клиент: ${customerEmail}</p>
    `,
  });
}
