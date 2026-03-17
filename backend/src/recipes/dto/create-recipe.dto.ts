import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BrewMethod } from '../brew-method.enum';

export class CreateRecipeDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @IsEnum(BrewMethod)
  brewMethod!: BrewMethod;

  @IsString()
  @MaxLength(1000)
  description!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  coffeeGrams!: number;

  @Type(() => Number)
  @IsInt()
  @Min(50)
  @Max(2000)
  waterMl!: number;

  @IsString()
  @MaxLength(40)
  grindSize!: string;

  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(3600)
  brewTimeSeconds!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  steps!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(60)
  authorName?: string;
}
