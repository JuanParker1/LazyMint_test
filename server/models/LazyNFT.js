const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LazyNFTSchema = new Schema({
  tokenID: {
    type: Number,
    required: true
  },
  uri: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  signature: {
    type: Object,
    required: true
  },
  owner: {
    type: String,
  }
});

module.exports = mongoose.model('lazyNFT', LazyNFTSchema);
