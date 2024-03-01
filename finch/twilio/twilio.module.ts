import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TwilioService } from './twilio.service';
import { LoggerService } from '../config/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from '../sites/site.entity';
import { SiteRepository } from '../sites/site.repository';
import { GlossaryModule } from '../glossaries/glossary.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ Site, SiteRepository, ]),
    forwardRef(() => GlossaryModule),
  ],
  providers: [ TwilioService, LoggerService, ],
  exports: [ TwilioService, ],
})
export class TwilioModule { }
