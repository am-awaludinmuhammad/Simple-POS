import swaggerJsdoc from "swagger-jsdoc";
import openApiDefinition from "./openapi-definition.js";

// Import all module docs to register their endpoints
import "../modules/auth/auth.docs.js";

const options = {
  definition: openApiDefinition,
  apis: ["src/modules/**/*.docs.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
