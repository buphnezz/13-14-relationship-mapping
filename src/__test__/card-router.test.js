'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateCategoryMock } from './lib/category-mock';
import { pCreateCardMock, pRemoveCardMock } from './lib/card-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/cards`;

describe('/api/cards', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveCardMock);

  describe('POST /api/cards', () => {
    test('200 status code in creation', () => {
    // Zachary - to create a 'real' card I need a mock category
      return pCreateCategoryMock()
        .then((categoryMock) => {
          const cardToPost = {
            videoconsole: faker.lorem.words(10),
            videogame: faker.lorem.words(11),
            category: categoryMock._id,
          };

          return superagent.post(apiUrl) // Zachary 
            .send(cardToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });
  describe('PUT /api/cards', () => {
    test('200 status code in creation', () => {
      // Zachary - to create a 'real' card I need a mock category
      let cardToUpdate = null;
      return pCreateCardMock()
        .then((mock) => {
          cardToUpdate = mock.card;
          return superagent.put(`${apiUrl}/${mock.card._id}`)
            .send({ videoconsole: 'Gregor and The Houd' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.videoconsole).toEqual('Gregor and The Hound');
          expect(response.body.videogame).toEqual(cardToUpdate.videogame);
        });
    });
  });
});
