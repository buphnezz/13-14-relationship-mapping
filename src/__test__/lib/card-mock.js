'use strict';

import faker from 'faker';
import Videogame from '../../model/videogame-model';
import * as videoconsoleMock from './videoconsole-mock';
// import { pCreateVideoconsoleMock, pRemoveVideoconsoleMock } from '../lib/videoconsole-mock';

const pCreateVideogameMock = () => {
  const resultMock = {};

  return videoconsoleMock.pCreateVideoconsoleMock() // Zachary - creating a videoconsole
    .then((createdVideoconsole) => {
    // Zachary - Step 2: Create a new videogame
      resultMock.videoconsole = createdVideoconsole;

      return new Videogame({
        videotitle: faker.lorem.words(15),
        videocontent: faker.lorem.words(20),
        videoconsole: createdVideoconsole._id,
      }).save();
    })
    .then((newVideogame) => {
      resultMock.videogame = newVideogame;
      return resultMock;
    });
};

const pRemoveVideogameMock = () => Promise.all([
  Videogame.remove({}),
  videoconsoleMock.pRemoveVideoconsoleMock(),
]);

export { pCreateVideogameMock, pRemoveVideogameMock };
