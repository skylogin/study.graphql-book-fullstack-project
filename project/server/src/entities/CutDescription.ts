import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@Entity()
@ObjectType()
export class CutDescription extends BaseEntity {
  @PrimaryColumn({ comment: '명장면 번호' })
  @Field(() => Int, { description: '명장면 번호' })
  id: number;

  @Field({ description: '명장면 설명' })
  @Column({ comment: '명장면 설명' })
  contents: string;

  @Field(() => String, { description: '생성 일자' })
  @CreateDateColumn({ comment: '생성 일자' })
  createdAt: Date;

  @Field(() => String, { description: '수정 일자' })
  @UpdateDateColumn({ comment: '수정 일자' })
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cutDescription)
  user: User;

  @RelationId((cutDescription: CutDescription) => cutDescription.user)
  userId: number;
}
