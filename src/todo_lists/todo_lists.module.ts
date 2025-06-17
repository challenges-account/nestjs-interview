import { Module, forwardRef } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TodoListsItemsModule } from './todo_lists_item/todo_lists_items.module';

@Module({
  imports: [forwardRef(() => TodoListsItemsModule)],
  controllers: [TodoListsController],
  providers: [
    { provide: TodoListsService, useValue: new TodoListsService([]) },
  ],
  exports: [TodoListsService],
})
export class TodoListsModule {}
