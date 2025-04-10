import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Reservation API",
      version: "1.0.0",
      description: "API documentation for the Movie Reservation System",
      contact: {
        name: "API Support",
        email: "codistiano@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "fail",
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./routes/*.js",
    "./routes/admin/*.js",
    "./routes/user/*.js",
    "./models/*.js",
  ],
};

export const specs = swaggerJsdoc(options);
