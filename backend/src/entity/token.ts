import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {IsDefined, IsEnum, validate} from 'class-validator';

import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import {TOKEN_TYPE} from '../enum/tokenType';
import User from './user';

@Entity()
export default class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsDefined()
  @ManyToOne(() => User, {eager: true})
  @JoinColumn()
  user: User;

  @IsDefined()
  @IsEnum(TOKEN_TYPE)
  @Column({type: 'enum', enum: TOKEN_TYPE})
  type: TOKEN_TYPE;

  @Column({default: true})
  isValid: boolean;

  @IsDefined()
  @Column({type: 'timestamptz'})
  expiryDate: Date;

  @CreateDateColumn({type: 'timestamptz'})
  public createdAt: Date;

  @UpdateDateColumn({type: 'timestamptz'})
  public updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  public async validateToken() {
    const errors = await validate(this);

    if (errors.length > 0) {
      throw new CustomError(
        errorCode.ENTITY_VALIDATION_ERROR,
        errors.toString()
      );
    }
  }
}
