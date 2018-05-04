'use strict';

import mongoose from 'mongoose';

const videoconsoleSchema = mongoose.Schema({
  videotitle: {
    type: String,
    required: true,
    unique: true,
  },
  videocontent: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  rating: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  // this is your "many" model that you'll think about tomorrow
  videogames: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'videogame', // your "many" model name goes here
    },
  ],
});

export default mongoose.model('videoconsole', videoconsoleSchema);
