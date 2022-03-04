import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { API_KEY, SENDER_EMAIL, SENDER_NAME } from './mailchip.config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailchimp = require('@mailchimp/mailchimp_transactional');

@Injectable()
export class MailchipService {
  #mailchimp: any;
  constructor(
    @Inject(API_KEY) apiKey: string,
    @Inject(SENDER_EMAIL) private senderEmail: string,
    @Inject(SENDER_NAME) private senderName: string
  ) {
    this.#mailchimp = mailchimp(apiKey);
  }

  async test() {
    try {
      return await this.#mailchimp.users.ping();
    } catch (error: any) {
      throw new BadRequestException(error?.message);
    }
  }

  async send(
    data: { html: string; text: string; subject: string },
    to: { email: string; name: string; to?: boolean }[]
  ) {
    try {
      const { html, text, subject } = data;
      const response = await this.#mailchimp.messages.send({
        message: {
          html,
          text,
          subject,
          from_email: this.senderEmail,
          from_name: this.senderName,
          to,
          important: true,
        },
      });
      return response;
    } catch (error: any) {
      throw new BadRequestException(error?.message);
    }
  }

  async sendTemplate(
    template_name: string,
    template_content: { name: string; content: string }[],
    to: { email: string; name: string; to?: boolean }[],
    subject: string
  ) {
    try {
      const response = await this.#mailchimp.messages.sendTemplate({
        template_name,
        template_content,
        message: {
          to,
          from_email: this.senderEmail,
          from_name: this.senderName,
          subject,
          important: true,
        },
      });
      return response;
    } catch (error: any) {
      throw new BadRequestException(error?.message);
    }
  }
}
