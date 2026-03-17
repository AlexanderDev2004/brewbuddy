import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.recipesService.remove(id);
  }
}
