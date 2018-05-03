'use strict';

import logger from '../lib/logger';

export default (request, response, next) => {
  logger.log(logger.INFO, `Processing a ${request.method} on ${request.url}`);
  return next(); // Zachary - making sure I call next
};
