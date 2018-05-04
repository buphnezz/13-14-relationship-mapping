'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Videoconsole from './videoconsole-model';

const videogameSchema = mongoose.Schema({
  videotitle: {
    type: String,
    required: true,
    unique: true,
  },
  videocontent: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  videoconsole: {
    type: mongoose.Schema.Types.ObjectId, // represents an id of another 
    // object in mongo...this is _id.
    required: true, // we want to know who owns this thing, where
    ref: 'videoconsole', // tells which schema you're trying to link to, must copy the exact string in this ref: field
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
      videoconsoleFound.videogames.push(this._id);
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
      videoconsoleFound.videogames = videoconsoleFound.videogames.filter((videogame) => {
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
