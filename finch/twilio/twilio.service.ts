import { BadGatewayException, BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import { ServiceContext } from 'twilio/lib/rest/verify/v2/service';

import { BaseMessageDto } from '../common';
import { LoggerService } from '../config/logger.service';
import { VerifyCodeDto } from '../common/DTOs';
import { MailingTemplateName, SendingChannel } from '../common/enums/general';
import { SiteRepository } from '../sites/site.repository';
import { queries } from './common/queries';
import {
  PROBAND_REMINDER_SENGRID_EMAIL_TEMPLATE_PATTERN,
  PROBAND_INVITATION_SENGRID_EMAIL_TEMPLATE_PATTERN,
  PROBAND_REMINDER_SENGRID_SMS_TEMPLATE_PATTERN,
  PROBAND_INVITATION_SENGRID_SMS_TEMPLATE_PATTERN
} from '../common/constants/mailings';
import { encodeBase64 } from '../common/utilities/encoding-decoding';
import { replaceNullableFields } from '../common/utilities/general';
import { GlossaryService } from '../glossaries/glossary.service';
import { getGlossaryValue, getSubGlossaryValue } from './common/helper';
import { FhqTemplateForDashboardResponseDto, FhqTemplateForNonDashboardResponseDto } from '../fhq-templates/DTO';
import { Request } from '../common/libs/request';
import { FhqTemplateType } from '../common/SQL-enums';
import { Individual } from '../individuals/individual.entity';
import { JSON_CONTENT_TYPE } from '../common/constants/headers';
import { DateTime } from 'luxon';
import { compile } from 'handlebars';
import { ITemplateResponse, ITemplatesResponse, ITemplateVersionResponse, ITemplate } from './common/interfaces';

@Injectable()
export class TwilioService {
  constructor (
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @InjectRepository(SiteRepository)
    private readonly siteRepository: SiteRepository,
    @Inject(forwardRef(() => GlossaryService))
    private readonly glossaryService: GlossaryService
  ) {
    const accountSid = config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = config.get<string>('TWILIO_AUTH_TOKEN');
    const sid = config.get<string>('TWILIO_SID');
    const sendGridKey = config.get<string>('SENDGRID_API_KEY');
    this.client = twilio(accountSid, authToken);
    this.sgMailClient = sgMail.setApiKey(sendGridKey);
    this.verificationClient = this.client.verify.services(sid);
    this.emailSender = config.get<string>('MAIL_SENDER');
    this.headers = {
      ...JSON_CONTENT_TYPE,
      'Authorization': `Bearer ${this.config.get<string>('SENDGRID_API_KEY')}`,
    };
    this.baseSengridTemplateApiUrl = 'https://api.sendgrid.com/v3/templates';
    this.nodeEnv = config.get<string>('NODE_ENV');
    this.messagingServiceSid = config.get<string>('MESSAGING_SERVICE_SID');
    this.baseFhqUrl = config.get<string>('BASE_FHQ_URL');
    this.baseControlUrl = config.get<string>('BASE_CONTROL_URL');
    this.baseDashboardUrl = config.get<string>('BASE_DASHBOARD_URL');
    this.baseApiUrl = config.get<string>('BASE_API_URL');
  }

  private readonly client;
  private readonly verificationClient: ServiceContext;
  private readonly sgMailClient;
  private readonly emailSender: string;
  private readonly headers: Record<string, string>;
  private readonly baseSengridTemplateApiUrl: string;
  private readonly nodeEnv: string;
  private readonly messagingServiceSid: string;
  private readonly baseFhqUrl: string;
  private readonly baseControlUrl: string;
  private readonly baseDashboardUrl: string;
  private readonly baseApiUrl: string;

  async sendConfirmationEmail (email: string, templateId: string, substitutions: object): Promise<BaseMessageDto> {
    let verification;
    this.logger.log('Sending email (request)', { email, templateId, substitutions, });
    try {
      verification = await this.verificationClient.verifications
        .create({
          channelConfiguration: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            template_id: templateId,
            substitutions: {
              email: email,
              ...substitutions,
            },
          }, to: email, channel: SendingChannel.EMAIL,
        });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new BadGatewayException(e.message);
    }
    if (!verification) {
      this.logger.error(BadRequestException, verification);
      throw new BadRequestException('Invalid query');
    }
    this.logger.log('Sending email (response)', verification);

    return { message: 'Confirmation email was sent successfully', };
  }

  async verifyEmail (query: VerifyCodeDto): Promise<BaseMessageDto> {
    let verification;
    try {
      verification = await this.verificationClient.verificationChecks
        .create({ to: query.email, code: query.code, });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new BadGatewayException(e.message);
    }
    if (!verification?.valid) {
      this.logger.error(BadRequestException, verification);
      throw new BadRequestException('Verification code is incorrect');
    }

    this.logger.log('Verified email', verification);
    return { message: 'Confirmation email was sent successfully', };
  }

  async getHandlebars (personId: string | number, type: MailingTemplateName, otherCommonProperties?: Array<any>): Promise<any> {
    const query = queries[type];

    let commonProperties = [ personId, ];
    if (otherCommonProperties) {
      commonProperties = commonProperties.concat(otherCommonProperties);
    }

    const handlebars = await this.siteRepository.query(query, commonProperties);
    const result = this.getCustomHandlebars(handlebars[0], personId);
    const templateReplacer = replaceNullableFields(result);

    return this.parseGlossaryValue(templateReplacer);
  }

  parseGlossaryValue (object: object): object {
    Object.keys(object).forEach(key => {
      switch (key) {
        case 'admin_prefix':
        case 'user_prefix':
          object[key] = getGlossaryValue(this.glossaryService.getPrefixes(), object[key], 'name');
          break;
        case 'site_country':
          object[key] = 'USA'; //for v1
          break;
        case 'site_state':
          object[key] = getSubGlossaryValue(this.glossaryService.getCountries(), object[key], 'name', 'states');
          break;
      }
    });

    return object;
  }

  async sendEmail (email: string, templateId: string, substitutions: object): Promise<BaseMessageDto> {
    try {
      const result = await this.sgMailClient.send({
        to: email,
        from: this.emailSender,
        templateId: templateId,
        dynamicTemplateData: {
          email,
          ...substitutions,
        },
      });
      this.logger.log('result object', result);
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new BadGatewayException(e.message);
    }

    return { message: 'Email was sent successfully', };
  }

  async sendSendgridSms (phone: string, body: string): Promise<BaseMessageDto> {
    try {
      await this.client.messages
        .create({
          body: body,
          messagingServiceSid: this.messagingServiceSid,
          to: phone,
        });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new BadGatewayException(e.message);
    }

    return { message: 'SMS was sent successfully', };
  }

  async getTemplates (body: ITemplate): Promise<Array<FhqTemplateForDashboardResponseDto>> {
    const result = [];
    const allTemplates = await this.readAllTemplates();
    const invitationTemplates = allTemplates.templates.filter(template => body.templatesFromDB.includes(template.id));

    if (!invitationTemplates) throw new BadRequestException('Templates not found');
    for (const template of invitationTemplates) {
      if (!template.versions[0].active) throw new BadRequestException('Template has not active versions');
      const version = await this.getVersionsById(template.id, template.versions[0].id);
      result.push({
        title: template.name,
        type: this.getType(template.name),
        templateId: template.id,
        subject: version.subject,
        body: version.html_content,
        isDefault: body.defaultFhqTemplateIds.includes(template.id),
      });
    }
    return this.substituteValue(body.probandId, body.type, result, body.options);
  }

  async getTemplateList (templatesFromDB: Array<string>, defaultFhqTemplateIds: Array<string>): Promise<Array<FhqTemplateForNonDashboardResponseDto>> {
    const allTemplates = await this.readAllTemplates();
    const results = allTemplates.templates.filter(template => templatesFromDB.includes(template.id));
    return results.map(template => {
      return {
        title: template.name,
        type: this.getType(template.name),
        templateId: template.id,
        isDefault: defaultFhqTemplateIds.includes(template.id),
      };
    });
  }

  async readTemplateById (templateId: string): Promise<ITemplateResponse> {
    const twilio = await new Request(`${this.baseSengridTemplateApiUrl}/${templateId}`, this.headers);
    return twilio.get<ITemplateResponse>();
  }

  async sendSms (individual: Individual, smsTemplateId: string, type: MailingTemplateName, options?: Array<any>): Promise<BaseMessageDto> {
    const body = await this.getSmsBody(individual, smsTemplateId, type, options);
    return this.sendSendgridSms(individual.phone, body);
  }

  private async substituteValue (personId: string | number, type: MailingTemplateName, templates: Array<any>, otherCommonOptions?: Array<any>): Promise<Array<FhqTemplateForDashboardResponseDto>> {
    const handlebars = await this.getHandlebars(personId, type, otherCommonOptions);
    templates.map(template => {
      template.body = compile(JSON.stringify(template.body))(handlebars);
    });
    return templates;
  }

  private async getVersionsById (templateId: string, versionId: string): Promise<ITemplateVersionResponse> {
    const version = await this.readTemplateVersion(templateId, versionId);
    if (!version || !version.active) throw new BadRequestException('Version not found or not active');
    return version;
  }

  private async readAllTemplates (): Promise<ITemplatesResponse> {
    const twilio = await new Request(this.baseSengridTemplateApiUrl, this.headers);
    return twilio.get<ITemplatesResponse>({ query: { 'generations': 'legacy,dynamic', }, });
  }

  private async readTemplateVersion (templateId: string, versionId: string): Promise<ITemplateVersionResponse> {
    const twilio = await new Request(`${this.baseSengridTemplateApiUrl}/${templateId}/versions/${versionId}`, this.headers);
    return twilio.get<ITemplateVersionResponse>();
  }

  private getType (name: string): FhqTemplateType {
    switch (name) {
      case name.match(PROBAND_INVITATION_SENGRID_EMAIL_TEMPLATE_PATTERN)?.input:
        return FhqTemplateType.EMAIL;
      case name.match(PROBAND_REMINDER_SENGRID_EMAIL_TEMPLATE_PATTERN)?.input:
        return FhqTemplateType.EMAIL_REMINDER;
      case name.match(PROBAND_INVITATION_SENGRID_SMS_TEMPLATE_PATTERN)?.input:
        return FhqTemplateType.SMS;
      case name.match(PROBAND_REMINDER_SENGRID_SMS_TEMPLATE_PATTERN)?.input:
        return FhqTemplateType.SMS_REMINDER;
    }
  }

  private async getSmsBody (individual: Individual, smsTemplateId: string, type: MailingTemplateName, options?: Array<any>): Promise<string> {
    const smsTemplate = await this.readTemplateById(smsTemplateId);
    const smsTemplateVersion = await this.getVersionsById(smsTemplateId, smsTemplate.versions[0].id);

    const substitute = await this.substituteValue(individual.id, type, [ { body: smsTemplateVersion.html_content, }, ], options);

    return substitute[0].body;
  }

  private getCustomHandlebars (value: any, personId: number | string ): any {
    value['env'] = `This letter was sent from ${this.nodeEnv} environment.`;
    value['fhq_url'] = `${this.baseFhqUrl}/has-credentials?remoteHash=${value['remoteHash']}`;
    value['fhq_forgot_password'] = `${this.baseFhqUrl}/reset-password?authenticationCode=${encodeBase64(JSON.stringify({ probandId: personId, }))}&remoteHash=${value['remoteHash']}`;
    value['control_url'] = this.baseControlUrl;
    value['dashboard_url'] = this.baseDashboardUrl;
    value['fhq_email_branding_logo_url'] = value['fileId'] ? this.baseApiUrl + `/download?fileId=${value['fileId']}` : this.baseApiUrl + '/download/default-fhq-email-branding-logo';
    if (value['appointment_start_time']) {
      const timezone = getGlossaryValue(this.glossaryService.getTimezones(), value['timezoneId'], 'name');
      value['appointment_date'] = DateTime.fromJSDate(value['appointment_start_time']).setZone(timezone).toFormat('MM/dd/yyyy');
      value['appointment_start_time'] = DateTime.fromJSDate(value['appointment_start_time']).setZone(timezone).setLocale('en').toLocaleString(DateTime.TIME_SIMPLE);
      value['appointment_end_time'] = DateTime.fromJSDate(value['appointment_end_time']).setZone(timezone).setLocale('en').toLocaleString(DateTime.TIME_SIMPLE);
    } else {
      value['appointment_date'] = null;
    }
    return value;
  }
}
