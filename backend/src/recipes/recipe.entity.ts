import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BrewMethod } from './brew-method.enum';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  title!: string;

  @Column({ type: 'enum', enum: BrewMethod })
  brewMethod!: BrewMethod;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int' })
  coffeeGrams!: number;

  @Column({ type: 'int' })
  waterMl!: number;

  @Column({ length: 40 })
  grindSize!: string;

  @Column({ type: 'int' })
  brewTimeSeconds!: number;

  @Column({ type: 'simple-array' })
  steps!: string[];

  @Column({ length: 60, nullable: true })
  authorName!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
