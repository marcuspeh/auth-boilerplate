import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForgetPasswordTokenEnum1705139040590 implements MigrationInterface {
    name = 'AddForgetPasswordTokenEnum1705139040590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."token_type_enum" RENAME TO "token_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."token_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "type" TYPE "public"."token_type_enum" USING "type"::"text"::"public"."token_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."token_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."token_type_enum_old" AS ENUM('0')`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "type" TYPE "public"."token_type_enum_old" USING "type"::"text"::"public"."token_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."token_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."token_type_enum_old" RENAME TO "token_type_enum"`);
    }

}
