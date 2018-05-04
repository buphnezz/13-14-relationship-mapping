'use strict';

import faker from 'faker';
import Card from '../../model/card-model';
import * as categoryMock from './category-mock';
// import { pCreateCategoryMock, pRemoveCategoryMock } from '../lib/category-mock';

const pCreateCardMock = () => {
  const resultMock = {};

  return categoryMock.pCreateCategoryMock() // Zachary - creating a category
    .then((createdCategory) => {
    // Zachary - Step 2: Create a new card
      resultMock.category = createdCategory;

      return new Card({
        videoconsole: faker.lorem.words(15),
        videogame: faker.lorem.words(20),
        category: createdCategory._id,
      }).save();
    })
    .then((newCard) => {
      resultMock.card = newCard;
      return resultMock;
    });
};

const pRemoveCardMock = () => Promise.all([
  Card.remove({}),
  categoryMock.pRemoveCategoryMock(),
]);

export { pCreateCardMock, pRemoveCardMock };
