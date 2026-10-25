const openApiDefinition = {
  openapi: "3.0.0",
  info: {
    title: "POS API",
    version: "1.0.0",
    description: "Point of Sale System API Documentation",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "http://localhost:5000",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          username: { type: "string" },
          phoneNumber: { type: "string" },
          role: {
            type: "object",
            properties: {
              id: { type: "string" },
              code: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
          code: { type: "string" },
          statusCode: { type: "number" },
        },
      },
    },
  },
} as const;

export default openApiDefinition;
