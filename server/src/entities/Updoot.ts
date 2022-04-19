import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int", default: 0 })
  value!: number;

  @PrimaryColumn()
  authorId!: number;

  @ManyToOne(() => User, (user) => user.updoots)
  author!: User;

  @PrimaryColumn()
  postId!: number;

  @ManyToOne(() => Post, (post) => post.updoots)
  posts!: User;
}
