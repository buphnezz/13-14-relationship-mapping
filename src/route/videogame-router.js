'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Videogame from '../model/videogame-model';

const jsonParser = bodyParser.json();
const videogameRouter = new Router();

videogameRouter.post('/api/videogames', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'VIDEOGAME-ROUTER POST: processing a request');
  if (!request.body.gametitle) {
    logger.log(logger.INFO, 'VIDEOGAME-ROUTER POST: No videogame title was provided');
    return next(new HttpErrors(400, 'Videogame title is required'));
  }
  return new Videogame(request.body).save()
    .then((videogame) => {
      logger.log(logger.INFO, 'VIDEOGAME-ROUTER POST: 200 status');
      return response.json(videogame);
    })
    .catch(next);
});

videogameRouter.get('/api/videogames/all', (request, response, next) => {
  logger.log(logger.INFO, 'VIDEOGAME-ROUTER GET ALL: Processing a request');
  const options = { runValidators: true, new: true };
  return Videogame.find(options)
    .then((videogames) => {
      logger.log(logger.INFO, 'VIDEOGAME-ROUTER GET ALL: 200 status');
      return response.json(videogames);
    })
    .catch(next);
});
// TODO: Optional validation

videogameRouter.get('/api/videogames/:id', (request, response, next, options) => {
  logger.log(logger.INFO, 'VIDEOGAME-ROUTER GET ID: Processing a request');
  return Videogame.findById(request.params.id, options)
    .then((videogame) => {
      logger.log(logger.INFO, 'VIDEOGAME-ROUTER GET ID: 200 status');
      return response.json(videogame);
    })
    .catch(next);
});

videogameRouter.put('/api/videogames/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'VIDEOGAME-ROUTER POST');
  const options = { runValidators: true, new: true };

  return Videogame.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedVideogame) => {
      if (!updatedVideogame) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpErrors(404, 'videogame not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedVideogame); // Zachary - Returns a 200
    })
    .catch(next);
});

export default videogameRouter;
