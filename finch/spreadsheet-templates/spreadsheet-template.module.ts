import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpreadsheetTemplate } from './spreadsheet-template.entity';
import { SpreadsheetTemplateController } from './spreadsheet-template.controller';
import { SpreadsheetTemplateRepository } from './spreadsheet-template.repository';
import { SpreadsheetTemplateService } from './spreadsheet-template.service';
import { LoggerService } from '../config/logger.service';
import { SpreadsheetTemplateCategoryModule } from '../spreadsheet-template-categories/spreadsheet-template-category.module';
import { UserModule } from '../users/user.module';
import { SiteModule } from '../sites/site.module';

@Module({
  controllers: [ SpreadsheetTemplateController, ],
  imports: [
    TypeOrmModule.forFeature([ SpreadsheetTemplate, SpreadsheetTemplateRepository, ]),
    forwardRef(() => SpreadsheetTemplateCategoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => SiteModule),
  ],
  providers: [ LoggerService, SpreadsheetTemplateService, ],
})
export class SpreadsheetTemplateModule {}
