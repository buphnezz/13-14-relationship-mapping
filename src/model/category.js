'use strict';

import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  videoconsole: {
    type: String,
    required: true,
    unique: true,
  },
  videogame: {
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
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'card', // your "many" model name goes here
    },
  ],
});

export default mongoose.model('category', categorySchema);
