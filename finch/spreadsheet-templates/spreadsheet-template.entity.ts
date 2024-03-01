import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../common';
import { User } from '../users/user.entity';
import { SpreadsheetTemplateCategory } from '../spreadsheet-template-categories/spreadsheet-template-category.entity';

@Entity( { name: 'spreadsheet_templates', })
export class SpreadsheetTemplate extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'json', })
  settings: object;

  @Column({ name: 'is_shared', })
  isShared: boolean;

  @ManyToOne(type => User, user => user.spreadsheetTemplates)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @ManyToOne(type => SpreadsheetTemplateCategory, spreadsheetTemplateCategories => spreadsheetTemplateCategories.spreadsheetTemplate)
  @JoinColumn({ name: 'category_id', })
  category: SpreadsheetTemplateCategory;
}
