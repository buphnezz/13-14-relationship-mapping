'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Videoconsole from './videoconsole-model';

const videogameSchema = mongoose.Schema({
  gametitle: {
    type: String,
    required: true,
    unique: true,
  },
  gamecontent: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  esrb: {
    type: String,
  },
  videoconsole: {
    type: mongoose.Schema.Types.ObjectId, // Zachary - this is _id
    required: true,
    ref: 'videoconsole',
  },
});

/* A mongoose hook needs access to 
  - a done() function
  - the object we are working with (mongoose calls this 'document')
  */
function videogamePreHook(done) { // done is using an (error, data) signature
  // Zachary - here, the value of 'contextual this' is the document
  return Videoconsole.findById(this.videoconsole)
    .then((videoconsoleFound) => {
      if (!videoconsoleFound) {
        throw new HttpError(404, 'videoconsole not found');
      }
      videoconsoleFound.videogame.push(this._id);
      return videoconsoleFound.save();
    })
    .then(() => done())
    .catch(done);
}

// Zachary - done has an (error, data) signature
const videogamePostHook = (document, done) => {
  return Videoconsole.findById(document.videoconsole)
    .then((videoconsoleFound) => {
      if (!videoconsoleFound) {
        throw new HttpError(500, 'videoconsole not found');
      }
      videoconsoleFound.videogame = videoconsoleFound.videogame.filter((videogame) => {
        return videogame._id.toString() !== document._id.toString();
      });
    })
    .then(() => done()) // Zachary - this implies success
    .catch(done); // Zachary - this is being called as done(result);
  // .catch(result => done(result)); is the equivilant to line 57
};

videogameSchema.pre('save', videogamePreHook);
videogameSchema.post('remove', videogamePostHook);

export default mongoose.model('videogame', videogameSchema);
