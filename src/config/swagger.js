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
        url:
          process.env.NODE_ENV === "production"
            ? `https://${
                process.env.RENDER_EXTERNAL_URL ||
                "movie-reservation-api.onrender.com"
              }`
            : "http://movie-reservation-api.onrender.com",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
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
    "./src/routes/*.js",
    "./src/routes/admin/*.js",
    "./src/routes/user/*.js",
    "./src/models/*.js",
  ],
};

export const specs = swaggerJsdoc(options);
