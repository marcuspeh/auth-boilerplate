import { IsDefined, IsEmail, IsString, validate } from "class-validator"
import CustomError from "../errors/customError"
import { errorCode } from "../errors/errorCode"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, BeforeInsert } from "typeorm"

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsDefined()
    @IsString()
    @Column({ length: 255 })
    name: string

    @IsDefined()
    @IsEmail()
    @Column({ unique:true })
    email: string

    @IsDefined()
    @IsString()
    @Column()
    password: string

    @CreateDateColumn()
    public createAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @BeforeUpdate()
    @BeforeInsert()
    public async validateUser() {
        const errors = await validate(this)

        if (errors.length > 0) {
            throw new CustomError(errorCode.ENTITY_VALIDATION_ERROR, errors.toString())
        }
    }
}