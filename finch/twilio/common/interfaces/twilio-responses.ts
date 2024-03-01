export interface ITemplateVersionResponse {
  id: string;

  // eslint-disable-next-line @typescript-eslint/camelcase
  template_id: string;

  active: number;

  name: string;

  // eslint-disable-next-line @typescript-eslint/camelcase
  generate_plain_content: boolean;

  // eslint-disable-next-line @typescript-eslint/camelcase
  updated_at: Date;

  editor: string;

  subject: string;

  // eslint-disable-next-line @typescript-eslint/camelcase
  plain_content: string;

  // eslint-disable-next-line @typescript-eslint/camelcase
  html_content: string;
}

export interface ITemplateResponse {
  id: string;

  name: string;

  generation: string;

  // eslint-disable-next-line @typescript-eslint/camelcase
  updated_at: string;

  versions: Array<ITemplateVersionResponse>;
}

export interface ITemplatesResponse {
  templates: Array<ITemplateResponse>;
}
