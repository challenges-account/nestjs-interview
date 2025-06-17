import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { NotFoundException } from '@nestjs/common';

describe('TodoListsController', () => {
  let todoListService: TodoListsService;
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    todoListService = new TodoListsService([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: todoListService }],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  describe('index', () => {
    it('should return the list of todolist', () => {
      expect(todoListsController.index()).toEqual([
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ]);
    });
  });

  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show(1)).toEqual({
        id: 1,
        name: 'test1',
      });
    });

    it('should throw NotFoundException if the todolist does not exist', () => {
      expect(() => todoListsController.show(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the todolist with the given id', () => {
      expect(todoListsController.update(1, { name: 'modified' })).toEqual({
        id: 1,
        name: 'modified',
      });

      expect(todoListService.get(1).name).toEqual('modified');
    });

    it('should throw NotFoundException if the todolist does not exist', () => {
      expect(() => todoListsController.update(999, { name: 'fail' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new todolist', () => {
      expect(todoListsController.create({ name: 'new' })).toEqual({
        id: 3,
        name: 'new',
      });

      expect(todoListService.all().length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete the todolist with the given id and all its items', () => {
      const mockDeleteAllFromList = jest.fn();
      (todoListService as any)['todoListItemsService'] = {
        deleteAllFromList: mockDeleteAllFromList,
      };

      expect(() => todoListsController.delete(1)).not.toThrow();
      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
      expect(mockDeleteAllFromList).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the todolist does not exist', () => {
      expect(() => todoListsController.delete(999)).toThrow(NotFoundException);
    });
  });
});
