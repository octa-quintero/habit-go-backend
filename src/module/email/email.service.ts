import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from '../../config/dotenv.config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_USER}>`,
      to,
      subject: '✅ Verifica tu cuenta en Habit Go',
      html: this.getVerificationEmailTemplate(name, verificationUrl),
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.transporter.sendMail({
      from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_USER}>`,
      to,
      subject: '🎉 ¡Bienvenido a Habit Go!',
      html: this.getWelcomeEmailTemplate(name),
    });
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const resetUrl = `${config.FRONTEND_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(to)}`;

    await this.transporter.sendMail({
      from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_USER}>`,
      to,
      subject: '🔐 Restablecer contraseña - Habit Go',
      html: this.getPasswordResetEmailTemplate(name, resetUrl),
    });
  }

  async sendRewardUnlockedEmail(
    to: string,
    name: string,
    rewardName: string,
    rewardIcon: string,
  ) {
    await this.transporter.sendMail({
      from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_USER}>`,
      to,
      subject: `🏆 ¡Nueva insignia desbloqueada: ${rewardName}!`,
      html: this.getRewardUnlockedEmailTemplate(name, rewardName, rewardIcon),
    });
  }

  private getVerificationEmailTemplate(
    name: string,
    verificationUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Habit Go</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${name}!</h2>
              <p>Gracias por registrarte en Habit Go. Para comenzar a crear y seguir tus hábitos, por favor verifica tu correo electrónico.</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
              </p>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p><small>Este enlace expirará en 24 horas.</small></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Habit Go. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Bienvenido a Habit Go!</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${name}!</h2>
              <p>¡Tu cuenta ha sido verificada exitosamente! Estamos emocionados de acompañarte en tu viaje de formación de hábitos.</p>
              
              <h3>¿Qué puedes hacer en Habit Go?</h3>
              
              <div class="feature">
                <strong>📝 Crea hábitos personalizados</strong>
                <p>Define tus propios hábitos diarios o semanales</p>
              </div>
              
              <div class="feature">
                <strong>🔥 Mantén rachas</strong>
                <p>Completa tus hábitos consecutivamente y observa crecer tu racha</p>
              </div>
              
              <div class="feature">
                <strong>🏆 Desbloquea insignias</strong>
                <p>Gana recompensas por tus logros y mantén la motivación</p>
              </div>
              
              <div class="feature">
                <strong>📊 Visualiza tu progreso</strong>
                <p>Mira tus estadísticas y sigue tu evolución</p>
              </div>
              
              <p style="margin-top: 30px;">¡Comienza hoy y construye los hábitos que transformarán tu vida!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Habit Go. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(
    name: string,
    resetUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Restablecer Contraseña</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${name}!</h2>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Habit Go.</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer mi contraseña</a>
              </p>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0;">
                  <li>Este enlace expirará en 1 hora</li>
                  <li>Si no solicitaste este cambio, ignora este correo</li>
                  <li>Tu contraseña actual seguirá siendo válida</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Habit Go. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getRewardUnlockedEmailTemplate(
    name: string,
    rewardName: string,
    rewardIcon: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
            .reward-icon { font-size: 80px; margin: 20px 0; }
            .reward-name { font-size: 24px; font-weight: bold; color: #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎊 ¡Felicitaciones!</h1>
            </div>
            <div class="content">
              <h2>¡Hola ${name}!</h2>
              <p>¡Has desbloqueado una nueva insignia!</p>
              
              <div class="reward-icon">${rewardIcon}</div>
              <div class="reward-name">${rewardName}</div>
              
              <p>Sigue así y continúa construyendo hábitos increíbles. ¡Tu dedicación está dando frutos!</p>
              
              <p style="margin-top: 30px;">
                <strong>Comparte tu logro con tus amigos y motívalos a unirse a Habit Go.</strong>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Habit Go. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
