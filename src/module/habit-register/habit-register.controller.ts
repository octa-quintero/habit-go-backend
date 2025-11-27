import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HabitRegisterService } from './habit-register.service';
import { CreateHabitRegisterDto } from './dto/create-habit-register.dto';
import { UpdateHabitRegisterDto } from './dto/update-habit-register.dto';

@Controller('habit-register')
export class HabitRegisterController {
  constructor(private readonly habitRegisterService: HabitRegisterService) {}

  @Post()
  create(@Body() createHabitRegisterDto: CreateHabitRegisterDto) {
    return this.habitRegisterService.create(createHabitRegisterDto);
  }

  @Get()
  findAll() {
    return this.habitRegisterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitRegisterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitRegisterDto: UpdateHabitRegisterDto) {
    return this.habitRegisterService.update(+id, updateHabitRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitRegisterService.remove(+id);
  }
}
