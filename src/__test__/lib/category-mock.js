'use strict';

import faker from 'faker';
import Category from '../../model/category-model';

const pCreateCategoryMock = () => {
  return new Category({
    videoconsole: faker.lorem.words(15),
    videogame: faker.lorem.words(20),
  }).save();
};

const pRemoveCategoryMock = () => Category.remove({});

export { pCreateCategoryMock, pRemoveCategoryMock };
