'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import Videoconsole from '../model/videoconsole-model';

const apiUrl = `http://localhost:${process.env.PORT}/api/videoconsoles`;

const mockVideoconsole = () => {
  return new Videoconsole({
    videotitle: faker.lorem.words(10),
    videocontent: faker.lorem.words(50),
  }).save();
};

describe('api/videoconsoles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Videoconsole.remove({})); 

  describe('POST api/videoconsoles', () => {
    test('POST - should respond with a 200 status', () => {
      const videoconsoleToPost = {
        videotitle: faker.lorem.words(10),
        videocontent: faker.lorem.words(50),
      };
      return superagent.post(apiUrl)
        .send(videoconsoleToPost)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.videotitle).toEqual(videoconsoleToPost.videotitle);
          expect(response.body.videocontent).toEqual(videoconsoleToPost.videocontent);
        });
    });

    test('POST - should display 409 due to duplicate videoconsole', () => {
      return mockVideoconsole()
        .then((videoconsolemock) => {
          const incompleteMockData = {
            videotitle: videoconsolemock.videotitle,
            videocontent: videoconsolemock.videocontent,
          };
          return superagent.post(apiUrl)
            .send(incompleteMockData);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('POST - should respond with 400 due to lack of videoconsole', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('POST - should respond with 400 due to bad json', () => {
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
      return mockVideoconsole()
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
      return mockVideoconsole()
        .then((videoconsole) => {
          tempVideoconsole = videoconsole;
          return superagent.get(`${apiUrl}/${videoconsole._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempVideoconsole._id.toString());
            });
        });
    });
    test('GET - should respond with 404 status if there is no videoconsole found', () => {
      return superagent.get(`${apiUrl}/invalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

describe('DELETE /api/videoconsoles', () => {
  test('should respond with 204 if there are no errors', () => {
    return pCreateVideoconsoleMock()
      .then((videoconsole) => {
        return superagent.delete(`${apiURL}/${videoconsole._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(204);
      });
  });
  test('should respond with 404 if there is no videoconsole id found', () => {
    return superagent.delete(`${apiUrl}/NotAnID`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
