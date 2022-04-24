import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Number)
  @Column({ type: "number" })
  authorId!: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  author!: User;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, (p) => p.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  parent: Post | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: "integer", default: null, nullable: true })
  parentId!: number | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: "integer", nullable: true })
  threadFirstId: number | null;

  @OneToMany(() => Post, (updoot) => updoot.parent)
  children: Post[];

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}
