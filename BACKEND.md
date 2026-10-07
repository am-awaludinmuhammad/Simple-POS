# Backend Development Conventions

## Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express
- ORM: Prisma
- Database: PostgreSQL
- Package manager: npm
- API style: REST
- API versioning: `/api/v1`

## Architecture

Use a modular, feature-based architecture.

Each business feature must have its own module.

Example:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── inventory/
│   └── transactions/
├── middlewares/
├── config/
├── lib/
├── app.ts
└── server.ts
```

Do not organize the entire application by technical layer such as:

```text
controllers/
services/
repositories/
models/
```

Instead, organize code by feature.

## Module Structure

Each module should contain only the files required by that feature.

Typical structure:

```text
modules/
└── products/
    ├── product.route.ts
    ├── product.controller.ts
    ├── product.service.ts
    ├── product.schema.ts
    └── product.types.ts
```

Not every module must contain all of these files.

Only create a file when the feature actually needs it.

For example, do not create `product.types.ts` if there are no module-specific types.

## Request Flow

The standard request flow is:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Each layer has a specific responsibility.

### Route

Routes define:

- HTTP method
- URL
- Middleware
- Controller handler

Example:

```ts
router.post(
  "/",
  validate(createProductSchema),
  productController.create
);
```

Routes must not contain business logic or database queries.

### Controller

Controllers are responsible for HTTP concerns:

- Reading request parameters
- Reading request body
- Reading authenticated user information
- Calling the service
- Returning the HTTP response

Example:

```ts
async function create(req: Request, res: Response) {
  const product = await productService.create(req.body);

  res.status(201).json({
    data: product,
  });
}
```

Controllers must remain thin.

Do not put business logic or Prisma queries directly inside controllers.

### Service

Services contain business logic and database operations.

Example:

```ts
async function create(data: CreateProductInput) {
  return prisma.product.create({
    data,
  });
}
```

Services may:

- Validate business rules
- Query Prisma
- Create records
- Update records
- Delete records
- Execute database transactions
- Call other services when necessary

## No Repository Layer

Do NOT create repositories.

The project intentionally uses:

```text
Controller → Service → Prisma
```

Do not introduce:

```text
Controller → Service → Repository → Prisma
```

Do not create files such as:

```text
product.repository.ts
user.repository.ts
transaction.repository.ts
```

Prisma is already the data access layer.

Keep database access inside the service.

## Prisma

Use a shared Prisma client.

The Prisma client should be initialized in:

```text
src/lib/prisma.ts
```

Example:

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Do not create a new `PrismaClient` inside individual services.

Do not access Prisma directly from routes or controllers.

Correct:

```text
Controller
    ↓
Service
    ↓
Prisma
```

Incorrect:

```text
Controller
    ↓
Prisma
```

## Database Transactions

Use `prisma.$transaction()` whenever an operation modifies multiple related records and must succeed or fail atomically.

For example, a POS sale may involve:

```text
Transaction
Transaction Items
Stock Movement
Stock Update
```

These operations should be executed within one database transaction when consistency requires it.

Example:

```ts
await prisma.$transaction(async (tx) => {
  // Create transaction
  // Create transaction items
  // Create stock movements
  // Update stock
});
```

Do not allow partial updates that can leave the database in an inconsistent state.

## Validation

Validate external input before it reaches business logic.

Validation should happen through middleware/schema validation.

Example:

```text
Request
  ↓
Validation
  ↓
Controller
  ↓
Service
```

Use the project's existing validation library and conventions.

Do not duplicate the same validation logic across multiple controllers.

## API Versioning

All API endpoints must use the version prefix:

```text
/api/v1
```

Examples:

```text
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

Use RESTful resource naming.

Prefer:

```text
GET /api/v1/products
POST /api/v1/products
```

Avoid action-based endpoints such as:

```text
GET /api/v1/getProducts
POST /api/v1/createProduct
```

Action-based endpoints are allowed only when the operation cannot reasonably be represented as a standard REST resource operation.

## Response Format

Successful responses should use:

```json
{
  "data": {}
}
```

Collection responses should use:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

Errors should use:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

Keep response formats consistent across modules.

## Error Handling

Do not use repetitive `try/catch` blocks in every controller unless the error needs special handling.

Use the application's centralized error-handling middleware.

Services should throw appropriate application errors when business rules are violated.

Example:

```ts
throw new AppError(
  "PRODUCT_NOT_FOUND",
  "Product not found",
  404
);
```

Controllers should not manually format every possible error.

## Naming Convention

### Files

Use `kebab-case`:

```text
product.controller.ts
product.service.ts
product.route.ts
product.schema.ts
```

### Variables and Functions

Use `camelCase`:

```ts
const productId = 1;

async function getProduct() {}
```

### Types and Interfaces

Use `PascalCase`:

```ts
type CreateProductInput = {};

interface ProductResponse {}
```

### Database

Use the existing Prisma schema convention.

Database table and column names should use `snake_case` when mapped to PostgreSQL.

Example:

```text
transaction_items
created_at
updated_at
```

TypeScript properties should remain idiomatic TypeScript.

## Module Boundaries

A module owns its business logic.

For example:

```text
products/
```

owns product-related operations.

```text
transactions/
```

owns transaction-related operations.

Avoid placing business logic in generic utility files.

Do not create a generic:

```text
utils.ts
```

and put unrelated business logic inside it.

Generic utilities should only contain genuinely reusable, domain-independent functionality.

## Cross-Module Dependencies

Modules may use functionality from another module when there is a genuine business dependency.

Prefer calling the other module's service rather than accessing its internal implementation directly.

For example:

```text
transactions
    ↓
products service
```

Avoid directly accessing another module's private files.

Do not create circular dependencies between modules.

If a dependency becomes complex, reconsider the domain boundary before introducing additional abstraction.

## Shared Code

Shared infrastructure belongs outside feature modules.

Examples:

```text
src/
├── config/
├── lib/
├── middlewares/
└── modules/
```

Examples of shared infrastructure:

- Prisma client
- Environment configuration
- Authentication middleware
- Error handling
- Logging
- Common HTTP middleware

Business logic should remain inside the relevant feature module.

## Authentication and Authorization

Authentication and authorization must be handled through middleware and services.

Do not duplicate authentication logic inside individual controllers.

Authorization rules should be explicit and centralized where possible.

Controllers should receive the authenticated user from the request context rather than manually resolving authentication information.

## Environment Variables

Never hardcode:

- Database credentials
- JWT secrets
- API keys
- Other sensitive configuration

Use environment variables.

Provide required variables through:

```text
.env.example
```

Never commit actual secrets.

## Adding a New Feature

When adding a new business feature:

1. Create a new module under `src/modules/`.
2. Add only the files required by the feature.
3. Define the route.
4. Add validation if required.
5. Add the controller.
6. Add the service.
7. Add Prisma/database changes if required.
8. Register the route in the appropriate router.
9. Add tests when applicable.

Example:

```text
src/modules/customers/
├── customer.route.ts
├── customer.controller.ts
├── customer.service.ts
├── customer.schema.ts
└── customer.types.ts
```

Do not modify unrelated modules unless the feature genuinely requires it.

## Do Not Over-Engineer

Keep the architecture simple.

Do not introduce:

- Repository pattern
- Use-case layer
- Domain-driven design layers
- CQRS
- Event sourcing
- Microservices
- Dependency injection containers
- Additional abstraction layers

unless there is a concrete requirement for them.

The default architecture is:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Prefer the simplest solution that satisfies the requirement.

## Consistency Rule

Before creating a new module, file, or pattern:

1. Inspect existing modules.
2. Follow the established structure.
3. Reuse existing utilities and conventions.
4. Do not introduce a new pattern when an existing pattern already solves the problem.

Consistency is more important than introducing a theoretically "better" architecture.

When uncertain, follow the closest existing module.