import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Budget API',
    version: '1.0.0',
    description: 'API SWAGGER',
  },
  servers: [
    {
      url: process.env.ENV_SWAGGER,
      description: 'Server local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts'], //file when will be code swaggerz
};

export const swaggerSpec = swaggerJSDoc(options);
