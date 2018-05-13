'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import errorMiddleWare from './error-middleware';
import loggerMiddleware from './logger-middleware';
import videoconsoleRouter from '../route/videoconsole-router';
import videogameRouter from '../route/videogame-router';

const app = express();
let server = null;

// #1 in chain
app.use(loggerMiddleware);
app.use(videoconsoleRouter);
app.use(videogameRouter);

// chain 2
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'SERVER: Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

// chain 3
app.use(errorMiddleWare);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `something happened, ${JSON.stringify(err)}`);
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `something happened, ${JSON.stringify(err)}`);
    });
};

export { startServer, stopServer };
