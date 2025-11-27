import { Injectable } from '@nestjs/common';
import { CreateHabitRegisterDto } from './dto/create-habit-register.dto';
import { UpdateHabitRegisterDto } from './dto/update-habit-register.dto';

@Injectable()
export class HabitRegisterService {
  create(createHabitRegisterDto: CreateHabitRegisterDto) {
    return 'This action adds a new habitRegister';
  }

  findAll() {
    return `This action returns all habitRegister`;
  }

  findOne(id: number) {
    return `This action returns a #${id} habitRegister`;
  }

  update(id: number, updateHabitRegisterDto: UpdateHabitRegisterDto) {
    return `This action updates a #${id} habitRegister`;
  }

  remove(id: number) {
    return `This action removes a #${id} habitRegister`;
  }
}
