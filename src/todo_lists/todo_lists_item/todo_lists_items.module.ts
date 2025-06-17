import { forwardRef, Module } from '@nestjs/common';
import { TodoListsItemsController } from './todo_lists_items.controller';
import { TodoListItemsService } from './todo_lists_items.service';
import { TodoListsModule } from '../todo_lists.module';
import { TodoListsService } from '../todo_lists.service';

@Module({
  imports: [forwardRef(() => TodoListsModule)],
  controllers: [TodoListsItemsController],
  providers: [
    {
      provide: TodoListItemsService,
      useFactory: (todoListsService: TodoListsService) => {
        return new TodoListItemsService(todoListsService, []);
      },
      inject: [TodoListsService],
    },
  ],
  exports: [TodoListItemsService],
})
export class TodoListsItemsModule {}
