import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoListsItemsController } from './todo_lists_items.controller';
import { TodoListItemsService } from './todo_lists_items.service';
import { TodoListsService } from '../todo_lists.service';

describe('TodoListsItemsController', () => {
  let todoListsService: TodoListsService;
  let todoListItemsService: TodoListItemsService;
  let todoListsItemsController: TodoListsItemsController;

  beforeEach(async () => {
    todoListsService = new TodoListsService([
      { id: 1, name: 'test list' },
      { id: 2, name: 'other list' },
    ]);

    todoListItemsService = new TodoListItemsService(todoListsService, [
      { id: 1, name: 'test1', completed: false, todoListId: 1 },
      { id: 2, name: 'test2', completed: false, todoListId: 1 },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsItemsController],
      providers: [
        { provide: TodoListsService, useValue: todoListsService },
        { provide: TodoListItemsService, useValue: todoListItemsService },
      ],
    }).compile();

    todoListsItemsController = app.get<TodoListsItemsController>(
      TodoListsItemsController,
    );
  });

  describe('index', () => {
    it('should return the list of todoListItems for a valid list', () => {
      expect(todoListsItemsController.index(1)).toEqual([
        { id: 1, name: 'test1', completed: false, todoListId: 1 },
        { id: 2, name: 'test2', completed: false, todoListId: 1 },
      ]);
    });

    it('should return empty array for a valid list with no items', () => {
      expect(todoListsItemsController.index(2)).toEqual([]);
    });

    it('should throw 404 for a non-existent list', () => {
      expect(() => todoListsItemsController.index(999)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('show', () => {
    it('should return the todoListItem with the given id and list', () => {
      expect(todoListsItemsController.show(1, 1)).toEqual({
        id: 1,
        name: 'test1',
        completed: false,
        todoListId: 1,
      });
    });

    it('should throw 404 if item does not exist in the list', () => {
      expect(() => todoListsItemsController.show(1, 999)).toThrow(
        NotFoundException,
      );
    });

    it('should throw 404 if list does not exist', () => {
      expect(() => todoListsItemsController.show(999, 1)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the todoListItem with the given id and list', () => {
      expect(
        todoListsItemsController.update(1, 1, {
          name: 'modified',
          completed: true,
        }),
      ).toEqual({ id: 1, name: 'modified', completed: true, todoListId: 1 });

      expect(todoListItemsService.get(1, 1).name).toEqual('modified');
      expect(todoListItemsService.get(1, 1).completed).toEqual(true);
    });

    it('should throw 404 if item to update is not found', () => {
      expect(() =>
        todoListsItemsController.update(1, 999, {
          name: 'modified',
          completed: true,
        }),
      ).toThrow(NotFoundException);
    });

    it('should throw 404 if list does not exist', () => {
      expect(() =>
        todoListsItemsController.update(999, 1, {
          name: 'modified',
          completed: true,
        }),
      ).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a todo list item for the given todoListId', () => {
      expect(todoListsItemsController.create(1, { name: 'new item' })).toEqual({
        id: 3,
        name: 'new item',
        completed: false,
        todoListId: 1,
      });

      expect(todoListItemsService.all(1).length).toBe(3);
    });

    it('should throw 404 if list does not exist', () => {
      expect(() =>
        todoListsItemsController.create(999, { name: 'fail' }),
      ).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the todoListItem with the given id and list', () => {
      expect(() => todoListsItemsController.delete(1, 1)).not.toThrow();
      expect(todoListItemsService.all(1).map((x) => x.id)).toEqual([2]);
    });

    it('should throw 404 if item to delete is not found', () => {
      expect(() => todoListsItemsController.delete(1, 999)).toThrow(
        NotFoundException,
      );
    });

    it('should throw 404 if list does not exist', () => {
      expect(() => todoListsItemsController.delete(999, 1)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAll', () => {
    it('should delete all items from the given todoListId', () => {
      expect(todoListItemsService.all(1).length).toBe(2);
      expect(() => todoListsItemsController.deleteAll(1)).not.toThrow();
      expect(todoListItemsService.all(1).length).toBe(0);
    });

    it('should throw 404 if list does not exist', () => {
      expect(() => todoListsItemsController.deleteAll(999)).toThrow(
        NotFoundException,
      );
    });
  });
});
