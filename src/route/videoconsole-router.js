'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Videoconsole from '../model/videoconsole-model';


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
});

videoconsoleRouter.put('/api/videoconsoles/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Videoconsole.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedVideoconsole) => {
      if (!updatedVideoconsole) {
        logger.log(logger.ERROR, 'VIDEOCONSOLE ROUTER: responding with 404 status code - !updatedVideoconsole');
        return next(new HttpErrors(404, 'videoconsole not found'));
      }

      logger.log(logger.INFO, 'PUT - responding with 200 status code');
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
      console.log('HHLELELOODOISFKJDSKFJDSF', request);
      if (!videoconsole) {
        logger.log(logger.INFO, 'DELETE - responding with a 400 status code');
        return next(new HttpErrors(400, 'videoconsole not found'));
      }
      if (!videoconsole) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code');
        return next(new HttpErrors(404, 'videoconsole not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return next(new HttpErrors(204, 'no content'));
    })
    .catch(next);
});

export default videoconsoleRouter;
