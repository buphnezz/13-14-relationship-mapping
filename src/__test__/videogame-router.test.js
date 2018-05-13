'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateVideoconsoleMock } from './lib/videoconsole-mock';
import { pCreateVideogameMock, pRemoveVideogameMock } from './lib/videogame-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/videogames`;

describe('/api/videogames', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveVideogameMock);

  describe('POST /api/videogames', () => {
    test('200 status code in creation', () => {
      // Zachary  - to create a 'real' videogame I need a mock category
      return pCreateVideoconsoleMock() // Zachary - Mock
        .then((videoconsoleMock) => {
          const videogameToPost = {
            gametitle: faker.lorem.words(10),
            gamecontent: faker.lorem.words(11),
            videoconsole: videoconsoleMock._id,
          };
          return superagent.post(apiUrl) // Zachary - making a real request
            .send(videogameToPost);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
    test('400', () => {
      const videogameToPost = {
        gametitle: faker.lorem.words(10),
        gamecontent: faker.lorem.words(11),
      };
      return superagent.post(apiUrl)
        .send(videogameToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    test('409', () => {
      return pCreateVideogameMock()
        .then((mock) => {
          const duplicateVideogame = {
            gametitle: mock.videogame.gametitle,
            gamecontent: mock.videogame.gamecontent,
            videoconsole: mock.videoconsole._id,
          };
          return superagent.post(apiUrl)
            .send(duplicateVideogame);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(409);
        });
    });
  }); // describe
  describe('PUT /api/videogames', () => {
    test('200 status code in creation', () => {
    // Zachary  - to create a 'real' videogame I need a mock category
      let videogameToUpdate = null;
      return pCreateVideogameMock()
        .then((mock) => {
          videogameToUpdate = mock.videogame;
          return superagent.put(`${apiUrl}/${mock.videogame._id}`)
            .send({ gametitle: 'Video Game Title!' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.gametitle).toEqual('Video Game Title!');
          expect(response.body.gamecontent).toEqual(videogameToUpdate.content).toEqual(videogameToUpdate.gamecontent);
        });
    });
    test('400', () => {
      return pCreateVideogameMock()
        .then((mock) => {
          return superagent.put(`${apiUrl}/${mock.videogame._id}`)
            .send({ gametitle: '' });
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    test('404', () => {
      return superagent.put(`${apiUrl}/WRONGID`)
        .send()
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('GET A SINGLE ID', () => {
    test('200', () => {
      let videogameToCompare = null;
      return pCreateVideogameMock()
        .then((mock) => {
          videogameToCompare = mock.videogame;
          return superagent.get(`${apiUrl}/${mock.videogame._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.gametitle).toEqual(videogameToCompare.body.gametitle);
          expect(response.body.gamecontent).toEqual(videogameToCompare.body.gamecontent);
          expect(response.body._id).toEqual(videogameToCompare.body._id.toString());
        });
    });
    test('404 due to a bad ID', () => {
      return superagent.get(`${apiUrl}/WRONGID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE', () => {
    test('204', () => {
      return pCreateVideogameMock()
        .then((mock) => {
          return superagent.del(`${apiUrl}/${mock.videogame._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body._id).toBeNull();
          expect(response.body).toEqual({});
        });
    });
    test('404 due to bad ID', () => {
      return superagent.del(`${apiUrl}/WRONGID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
