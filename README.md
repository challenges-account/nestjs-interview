# TodoApi (NestJS)

A simple, modular Todo List REST API built with NestJS and TypeScript.

## Features

- CRUD operations for Todo Lists and Todo List Items
- RESTful endpoints with error handling (404s, etc.)
- Modular service/controller structure
- In-memory data storage (no database)
- Unit tests for core logic

## Project Structure

```
src/
  app.module.ts
  main.ts
  interfaces/                # TypeScript interfaces for entities
  todo_lists/
    dtos/                    # Data Transfer Objects for validation
    todo_lists.controller.ts
    todo_lists.service.ts
    todo_lists.module.ts
    todo_lists_item/
      dtos/
      todo_lists_items.controller.ts
      todo_lists_items.service.ts
      todo_lists_items.module.ts
test/
  todo_lists.e2e-spec.ts     # (template for e2e, not implemented)
```

## Installation

```bash
npm install
```

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## API Endpoints

- `GET    /api/todolists` — List all todo lists
- `POST   /api/todolists` — Create a new todo list
- `GET    /api/todolists/:todoListId` — Get a specific todo list
- `PUT    /api/todolists/:todoListId` — Update a todo list
- `DELETE /api/todolists/:todoListId` — Delete a todo list (and all its items)

- `GET    /api/todolists/:todoListId/items` — List items in a list
- `POST   /api/todolists/:todoListId/items` — Add an item to a list
- `GET    /api/todolists/:todoListId/items/:todoListItemId` — Get a specific item
- `PUT    /api/todolists/:todoListId/items/:todoListItemId` — Update an item
- `DELETE /api/todolists/:todoListId/items/:todoListItemId` — Delete an item
- `DELETE /api/todolists/:todoListId/items` — Delete all items in a list

## Testing

```bash
# Unit tests
npm run test
```
