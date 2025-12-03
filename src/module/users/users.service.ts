import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Consulta si existe un usuario con el mismo email o username
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      if (existingUser) {
        if (existingUser.email === createUserDto.email) {
          throw new HttpException('Email en uso', HttpStatus.CONFLICT);
        }
        if (existingUser.username === createUserDto.username) {
          throw new HttpException('Usuario en uso', HttpStatus.CONFLICT);
        }
      }

      // Encriptado de contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Creación del usuario
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Guardado del usuario en la base de datos
      const savedUser = await this.userRepository.save(user);

      // Eliminar password de la respuesta
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: User[]; total: number }> {
    try {
      const [data, total] = await this.userRepository.findAndCount({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });

      return { data, total };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al obtener el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Verificar si el mail es diferente
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingEmail) {
          throw new HttpException('Email en uso', HttpStatus.CONFLICT);
        }
      }

      // Verificar si el username es diferente
      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUsername = await this.userRepository.findOne({
          where: { username: updateUserDto.username },
        });
        if (existingUsername) {
          throw new HttpException('Usuario en uso', HttpStatus.CONFLICT);
        }
      }

      // Encriptar nueva contraseña
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Actualizar usuario
      const updatedUser = this.userRepository.merge(user, updateUserDto);
      const savedUser = await this.userRepository.save(updatedUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al actualizar el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDeleteUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      if (!user.isActive) {
        throw new HttpException(
          'Usuario ya está desactivado',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.isActive = false;
      const savedUser = await this.userRepository.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al desactivar el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restoreUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, isActive: false },
      });

      if (!user) {
        throw new HttpException(
          'Usuario desactivado no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      user.isActive = true;
      const savedUser = await this.userRepository.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al restaurar el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
