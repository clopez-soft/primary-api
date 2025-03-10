import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum, IsArray } from 'class-validator';

import { ELECTORAL_LEVEL } from 'src/common/enums';

@InputType()
export class CreatePoliticalAllianceInput {
    @IsString()
    @IsNotEmpty()
    @Field({ nullable: false })
    name: string;

    @IsString()
    @IsNotEmpty()
    @Field({ nullable: false })
    code: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    description: string;

    @Field(() => ELECTORAL_LEVEL, { nullable: false, defaultValue: ELECTORAL_LEVEL.PRESIDENT })
    @IsEnum(ELECTORAL_LEVEL)
    @IsNotEmpty()
    level: ELECTORAL_LEVEL;

    @Field(() => [ String ], { nullable: true })
    @IsArray()
    @IsOptional()
    politic_parties: string[];

}

@InputType()
export class UpdatePoliticalAllianceInput extends CreatePoliticalAllianceInput {
    @Field({ nullable: false })
    @IsNotEmpty()
    @IsUUID()
    political_alliance_id: string;
}