'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateVideoConsoleMock } from './lib/videoconsole-mock';
import { pCreateVideoGameMock, pRemoveVideoGameMock } from './lib/videogame-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/videogames`;

describe('/api/videogames', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveVideoGameMock);

  describe('POST /api/videogames', () => {
    test('200 status code in creation', () => {
    // Zachary - to create a 'real' videogame I need a mock videoconsole
      return pCreateVideoConsoleMock()
        .then((videoconsoleMock) => {
          const videogameToPost = {
            videotitle: faker.lorem.words(10),
            videocontent: faker.lorem.words(11),
            videoconsole: videoconsoleMock._id,
          };

          return superagent.post(apiUrl) // Zachary 
            .send(videogameToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });
  describe('PUT /api/videogames', () => {
    test('200 status code in creation', () => {
      // Zachary - to create a 'real' videogame I need a mock videoconsole
      let videogameToUpdate = null;
      return pCreateVideoGameMock()
        .then((mock) => {
          videogameToUpdate = mock.videogame;
          return superagent.put(`${apiUrl}/${mock.videogame._id}`)
            .send({ videoconsole: 'Gregor and The Houd' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.videoconsole).toEqual('Gregor and The Hound');
          expect(response.body.videogame).toEqual(videogameToUpdate.videogame);
        });
    });
  });
});
