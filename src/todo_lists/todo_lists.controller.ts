import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListsService } from './todo_lists.service';

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  show(@Param('todoListId', ParseIntPipe) todoListId: number): TodoList {
    return this.todoListsService.get(todoListId);
  }

  @Post()
  create(@Body() dto: CreateTodoListDto): TodoList {
    return this.todoListsService.create(dto);
  }

  @Put('/:todoListId')
  update(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    return this.todoListsService.update(todoListId, dto);
  }

  @Delete('/:todoListId')
  delete(@Param('todoListId', ParseIntPipe) todoListId: number): void {
    this.todoListsService.delete(todoListId);
  }
}
