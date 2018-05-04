'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Videoconsole from '../model/videoconsole-model';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const videoconsoleRouter = new Router();

videoconsoleRouter.post('/api/videoconsoles', jsonParser, (request, response, next) => {
  if (!request.body.videotitle || !request.body.videocontent) {
    return next(new HttpErrors(400, 'Videotitle and videocontent are required'));
  }
  new Videoconsole(request.body).save()
    .then((videoconsole) => {
      logger.log(logger.INFO, 'ROUTER POST: 200');
      return response.json(videoconsole);
    })
    .catch(next);
  return undefined;
});

videoconsoleRouter.put('/api/videoconsoles/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Videoconsole.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedVideoconsole) => {
      if (!updatedVideoconsole) {
        logger.log(logger.ERROR, 'VIDEOCONSOLE ROUTER: responding with 404 status code - !updatedVideoconsole');
        return next(new HttpErrors(404, 'videoconsole not found'));
      }

      logger.log(logger.INFO, 'GET - responding with 200 status code');
      return response.json(updatedVideoconsole);
    })
    .catch(next);
});

videoconsoleRouter.get('/api/videoconsoles/:id', (request, response, next) => {
  return Videoconsole.findById(request.params.id)
    .then((videoconsole) => {
      if (!videoconsole) {
        logger.log(logger.ERROR, 'VIDEOCONSOLE ROUTER: responding with 404 status code !videoconsole');
        return next(new HttpErrors(404, 'videoconsole not found'));
      }

      logger.log(logger.INFO, 'VIDEOCONSOLE ROUTER: responding with 200 status code');
      logger.log(logger.INFO, `VIDEOCONSOLE ROUTER: ${JSON.stringify(videoconsole)}`);
      return response.json(videoconsole);
    })
    .catch(next);
});

videoconsoleRouter.delete('/api/videoconsoles/:id', (request, response, next) => {
  return Videoconsole.findByIdAndRemove(request.params.id)
    .then((videoconsole) => {
      if (!videoconsole) {
        logger.log(logger.ERROR, 'VIDEOCONSOLE ROUTER: responding with 404 !videoconsole');
        return next(new HttpErrors(404, 'videoconsole not found'));
      }

      logger.log(logger.INFO, 'VIDEOCONSOLE ROUTER: responding with 204 status code');
      return response.sendStatus(204);
    });
});

export default videoconsoleRouter;
