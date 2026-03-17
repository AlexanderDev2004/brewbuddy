import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...createRecipeDto,
      authorName: createRecipeDto.authorName ?? null,
    });

    return this.recipeRepository.save(recipe);
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with id "${id}" not found.`);
    }

    return recipe;
  }

  async remove(id: string): Promise<void> {
    const result = await this.recipeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Recipe with id "${id}" not found.`);
    }
  }
}
