'use strict';

import faker from 'faker';
import Videoconsole from '../../model/videoconsole-model';

const pCreateVideoconsoleMock = () => {
  return new Videoconsole({
    videoconsole: faker.lorem.words(15),
    videogame: faker.lorem.words(20),
  }).save();
};

const pRemoveVideoconsoleMock = () => Videoconsole.remove({});

export { pCreateVideoconsoleMock, pRemoveVideoconsoleMock };
