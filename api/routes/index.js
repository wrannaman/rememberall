import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import health from '../controllers/health/health.js'
import user from './user.js'
import media from './media.js'
import appRoutes from './app.js'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secret Agent',
      version: '2.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, but you can specify JWT or other formats here
        },
      },
    },
    security: [
      {
        bearerAuth: [], // This applies Bearer authentication globally to all endpoints
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

// const openapiSpecification = swaggerJSDoc(options);


export default async (app) => {
  app.get('/health', health)
  app.use('/*', (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next()
    // logger 
    if (req.method === 'POST') {
      console.log("req.url:", req.originalUrl, req?.body?.type, req?.body?.data?.length)
      next()
    } else {
      console.log("req.url:", req.baseUrl, req.query)
      next()
    }
  })

  user(app)
  media(app)
  appRoutes(app)
  // must be last!
  // app.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
}