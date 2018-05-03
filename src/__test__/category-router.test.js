'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Category from '../model/category';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/categories`;

const pCreateCategoryMock = () => {
  return new Category({
    videoconsole: faker.lorem.words(15),
    videogame: faker.lorem.words(2),
  }).save();
};

describe('api/categories', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Category.remove({}));

  describe('POST api/categories', () => {
    test('200', () => {
      const mockCategory = {
        videoconsole: faker.lorem.words(10),
        videogame: faker.lorem.words(50),
      };
      return superagent.post(apiUrl)
        .send(mockCategory)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.videoconsole).toEqual(mockCategory.videoconsole);
          expect(response.body.videogame).toEqual(mockCategory.videogame);
        });
    });

    test('409 due to duplicate videoconsole', () => {
      return pCreateCategoryMock()
        .then((category) => {
          const mockCategory = {
            videoconsole: category.videoconsole,
            videogame: category.videogame,
          };
          return superagent.post(apiUrl)
            .send(mockCategory);
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

  describe('PUT api/categories', () => {
    test('200 for succcesful PUT', () => {
      let categoryToUpdate = null;
      return pCreateCategoryMock()
        .then((category) => {
          categoryToUpdate = category;
          return superagent.put(`${apiUrl}/${category._id}`)
            .send({ videoconsole: 'I HAVE A NEW CATEGORY TITLE' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.videoconsole).toEqual('I HAVE A NEW CATEGORY TITLE');
          expect(response.body.videogame).toEqual(categoryToUpdate.videogame);
          expect(response.body._id).toEqual(categoryToUpdate._id.toString());
        });
    });
  });

  describe('GET /api/categories', () => {
    test('200', () => {
      let tempCategory = null;
      return pCreateCategoryMock()
        .then((category) => {
          tempCategory = category;
          return superagent.get(`${apiUrl}/${category._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempCategory._id.toString());
            });
        });
    });
  });

  describe('DELETE /api/categories', () => {
    test('204', () => {
      return pCreateCategoryMock()
        .then((category) => {
          return superagent.delete(`${apiUrl}/${category._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
