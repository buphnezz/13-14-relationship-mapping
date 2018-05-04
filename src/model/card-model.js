'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Category from './category-model';

const cardSchema = mongoose.Schema({
  videoconsole: {
    type: String,
    required: true,
    unique: true,
  },
  videogame: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // represents an id of another 
    // object in mongo...this is _id.
    required: true, // we want to know who owns this thing, where
    ref: 'category', // tells which schema you're trying to link to, must copy the exact string in this ref: field
  },
});

/* A mongoose hook needs access to 
  - a done() function
  - the object we are working with (mongoose calls this 'document')
  */
function cardPreHook(done) { // done is using an (error, data) signature
  // Zachary - here, the value of 'contextual this' is the document
  return Category.findById(this.category)
    .then((categoryFound) => {
      if (!categoryFound) {
        throw new HttpError(404, 'category not found');
      }
      categoryFound.cards.push(this._id);
      return categoryFound.save();
    })
    .then(() => done())
    .catch(done);
}

// Zachary - done has an (error, data) signature
const cardPostHook = (document, done) => {
  return Category.findById(document.category)
    .then((categoryFound) => {
      if (!categoryFound) {
        throw new HttpError(500, 'category not found');
      }
      categoryFound.cards = categoryFound.cards.filter((card) => {
        return card._id.toString() !== document._id.toString();
      });
    })
    .then(() => done()) // Zachary - this implies success
    .catch(done); // Zachary - this is being called as done(result);
  // .catch(result => done(result)); is the equivilant to line 57
};

cardSchema.pre('save', cardPreHook);
cardSchema.post('remove', cardPostHook);

export default mongoose.model('card', cardSchema);
