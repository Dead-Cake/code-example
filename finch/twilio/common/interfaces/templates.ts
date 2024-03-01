import { MailingTemplateName } from '../../../common/enums/general';

export interface ITemplate {
  probandId: string | number;

  templatesFromDB: Array<string>;

  defaultFhqTemplateIds: Array<string>;

  type: MailingTemplateName;

  options?: Array<string>;
}
