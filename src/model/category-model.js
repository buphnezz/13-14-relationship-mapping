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
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  // this is your "many model that you'll think about tomorrow
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'card', // your "many" model name goes here
    },
    // after the schema, youhave to add an object to tell mongoose 
    // how to save  so we type  'usePushEach: true,'
  ],
}, { // Zachary - This brace is closing the Schema definition
  usePushEach: true,
});

export default mongoose.model('category', categorySchema);
