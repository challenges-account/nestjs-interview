import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListItemsService } from './todo_lists_item/todo_lists_items.service';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];
  private readonly todoListItemsService?: TodoListItemsService;

  constructor(
    todoLists: TodoList[] = [],
    @Inject(forwardRef(() => TodoListItemsService))
    todoListItemsService?: TodoListItemsService,
  ) {
    this.todolists = todoLists;
    this.todoListItemsService = todoListItemsService;
  }

  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    return this.validateTodoListExists(id);
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.validateTodoListExists(id);

    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    this.validateTodoListExists(id);
    if (this.todoListItemsService) {
      this.todoListItemsService.deleteAllFromList(id);
    }
    const index = this.todolists.findIndex((x) => x.id === id);
    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }

  private nextId(): number {
    const last = this.todolists.map((x) => x.id).sort((a, b) => b - a)[0];
    return last ? last + 1 : 1;
  }

  private validateTodoListExists(id: number): TodoList {
    const list = this.todolists.find((list) => list.id === id);
    if (!list) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }
    return list;
  }
}
