import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { WebhookService } from '../webhook/webhook.service';

@Module({
  imports: [],
  providers: [WhatsappService, WebhookService],
  controllers: [WhatsappController],
  exports: [],
})
export default class WhatsappModule { }
