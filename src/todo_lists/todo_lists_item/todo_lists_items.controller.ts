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
import { CreateTodoListItemDto } from './dtos/create-todo_list_item';
import { UpdateTodoListItemDto } from './dtos/update-todo_list_item';
import { TodoListItem } from '../../interfaces/todo_list_item.interface';
import { TodoListItemsService } from './todo_lists_items.service';

@Controller('api/todolists/:todoListId/items')
export class TodoListsItemsController {
  constructor(private todoListsItemsService: TodoListItemsService) {}

  @Get()
  index(@Param('todoListId', ParseIntPipe) todoListId: number): TodoListItem[] {
    return this.todoListsItemsService.all(todoListId);
  }

  @Get('/:todoListItemId')
  show(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Param('todoListItemId', ParseIntPipe) todoListItemId: number,
  ): TodoListItem {
    return this.todoListsItemsService.get(todoListId, todoListItemId);
  }

  @Post()
  create(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Body() dto: CreateTodoListItemDto,
  ): TodoListItem {
    return this.todoListsItemsService.create(todoListId, dto);
  }

  @Put('/:todoListItemId')
  update(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Param('todoListItemId', ParseIntPipe) todoListItemId: number,
    @Body() dto: UpdateTodoListItemDto,
  ): TodoListItem {
    return this.todoListsItemsService.update(todoListId, todoListItemId, dto);
  }

  @Delete('/:todoListItemId')
  delete(
    @Param('todoListId', ParseIntPipe) todoListId: number,
    @Param('todoListItemId', ParseIntPipe) todoListItemId: number,
  ): void {
    this.todoListsItemsService.delete(todoListId, todoListItemId);
  }

  @Delete()
  deleteAll(@Param('todoListId', ParseIntPipe) todoListId: number): void {
    this.todoListsItemsService.deleteAllFromList(todoListId);
  }
}
