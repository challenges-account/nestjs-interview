import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { TodoListsService } from '../todo_lists.service';
import { CreateTodoListItemDto } from './dtos/create-todo_list_item';
import { UpdateTodoListItemDto } from './dtos/update-todo_list_item';
import { TodoListItem } from 'src/interfaces/todo_list_item.interface';

@Injectable()
export class TodoListItemsService {
  private readonly todoListsService: TodoListsService;
  private readonly todoListItems: TodoListItem[];

  constructor(
    @Inject(forwardRef(() => TodoListsService))
    todoListsService: TodoListsService,
    todoListItems: TodoListItem[] = [],
  ) {
    this.todoListsService = todoListsService;
    this.todoListItems = todoListItems;
  }

  all(todoListId: number): TodoListItem[] {
    this.validateTodoListExists(todoListId);
    return this.todoListItems.filter((item) => item.todoListId === todoListId);
  }

  get(todoListId: number, id: number): TodoListItem {
    this.validateTodoListExists(todoListId);
    const item = this.todoListItems.find(
      (item) => item.todoListId === todoListId && item.id === id,
    );
    this.validateTodoListItemExists(item, todoListId, id);
    return item;
  }

  create(todoListId: number, dto: CreateTodoListItemDto): TodoListItem {
    this.validateTodoListExists(todoListId);
    const todoListItem: TodoListItem = {
      id: this.nextId(),
      todoListId: todoListId,
      name: dto.name,
      completed: false,
    };
    this.todoListItems.push(todoListItem);
    return todoListItem;
  }

  update(
    todoListId: number,
    id: number,
    dto: UpdateTodoListItemDto,
  ): TodoListItem {
    this.validateTodoListExists(todoListId);
    const todoListItem = this.todoListItems.find(
      (item) => item.todoListId === todoListId && item.id === id,
    );
    this.validateTodoListItemExists(todoListItem, todoListId, id);
    todoListItem.name = dto.name;
    todoListItem.completed = dto.completed;
    return todoListItem;
  }

  delete(todoListId: number, id: number): void {
    this.validateTodoListExists(todoListId);
    const index = this.todoListItems.findIndex(
      (item) => item.todoListId === todoListId && item.id === id,
    );
    this.validateTodoListItemExists(this.todoListItems[index], todoListId, id);
    if (index > -1) {
      this.todoListItems.splice(index, 1);
    }
  }

  deleteAllFromList(todoListId: number): void {
    this.validateTodoListExists(todoListId);
    for (let i = this.todoListItems.length - 1; i >= 0; i--) {
      if (this.todoListItems[i].todoListId === todoListId) {
        this.todoListItems.splice(i, 1);
      }
    }
  }

  private nextId(): number {
    const last = this.todoListItems
      .map((item) => item.id)
      .sort((a, b) => b - a)[0];

    return last ? last + 1 : 1;
  }

  private validateTodoListExists(todoListId: number): void {
    const todoList = this.todoListsService.get(todoListId);
    if (!todoList) {
      throw new NotFoundException(`TodoList with ID ${todoListId} not found`);
    }
  }

  private validateTodoListItemExists(
    item: TodoListItem | undefined,
    todoListId: number,
    id: number,
  ): void {
    if (!item) {
      throw new NotFoundException(
        `TodoListItem with ID ${id} in TodoList ${todoListId} not found`,
      );
    }
  }
}
