import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition={
    openapi: '3.0.0',
    info: {
      title: 'Budget API',
      version: '1.0.0',
      description: 'Documentación de la API con Swagger',
    },
    servers: [
      {
        url: process.env.ENV_SWAGGER,
        description: 'Server local',
      },
    ],
}

const options = {
    swaggerDefinition,
    apis: ['src/routes/*.ts'], // files when we gonna to write swagger
  };
  
  export const swaggerSpec = swaggerJSDoc(options);