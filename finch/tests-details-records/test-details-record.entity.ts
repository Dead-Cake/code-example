import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Test } from '../tests/test.entity';
import { BaseEntity } from '../common';
import { GeneClassification } from '../gene-classifications/gene-classification.entity';

@Entity('test_details')
export class TestDetailsRecord extends BaseEntity {
  @Column({ name: 'gene_id', })
  geneId: number;

  @Column()
  variant: string;

  @Column({ name: 'classification_id', })
  classificationId: number;

  @ManyToOne(type => Test, test => test.testDetailsRecord)
  @JoinColumn({ name: 'test_id', })
  test: Test;

  @OneToMany(type => GeneClassification, geneClassification => geneClassification.testDetailsRecord)
  geneClassifications: Array<GeneClassification>;
}
