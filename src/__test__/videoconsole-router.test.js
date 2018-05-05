'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateVideoconsoleMock, pRemoveVideoconsoleMock } from './lib/videoconsole-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/videoconsoles`;

describe('api/videoconsoles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveVideoconsoleMock);
  describe('POST api/videoconsoles', () => {
    test('200', () => {
      const mockVideoconsole = {
        videotitle: faker.lorem.words(10),
        videocontent: faker.lorem.words(50),
      };
      return superagent.post(apiUrl)
        .send(mockVideoconsole)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.videotitle).toEqual(mockVideoconsole.videotitle);
          expect(response.body.videocontent).toEqual(mockVideoconsole.videocontent);
        });
    });

    test('409 due to duplicate videoconsole', () => {
      return pCreateVideoconsoleMock()
        .then((videoconsole) => {
          const mockVideoconsole = {
            videotitle: videoconsole.videotitle,
            videocontent: videoconsole.videocontent,
          };
          return superagent.post(apiUrl)
            .send(mockVideoconsole);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of videoconsole', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT api/videoconsoles', () => {
    test('200 for succcesful PUT', () => {
      let videoconsoleToUpdate = null;
      return pCreateVideoconsoleMock()
        .then((videoconsole) => {
          videoconsoleToUpdate = videoconsole;
          return superagent.put(`${apiUrl}/${videoconsole._id}`)
            .send({ videotitle: 'I HAVE A NEW VIDEOCONSOLE VIDEOTITLE' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.videotitle).toEqual('I HAVE A NEW VIDEOCONSOLE VIDEOTITLE');
          expect(response.body.videocontent).toEqual(videoconsoleToUpdate.videocontent);
          expect(response.body._id).toEqual(videoconsoleToUpdate._id.toString());
        });
    });
  });

  describe('GET /api/videoconsoles', () => {
    test('200', () => {
      let tempVideoconsole = null;
      return pCreateVideoconsoleMock()
        .then((videoconsole) => {
          tempVideoconsole = videoconsole;
          return superagent.get(`${apiUrl}/${videoconsole._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempVideoconsole._id.toString());
            });
        });
    });
  });

  describe('DELETE /api/videoconsoles', () => {
    test('204', () => {
      return pCreateVideoconsoleMock()
        .then((videoconsole) => {
          return superagent.delete(`${apiUrl}/${videoconsole._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
