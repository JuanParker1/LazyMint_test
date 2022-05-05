const express = require('express');
const LazyNFT = require('../../models/LazyNFT');
const router = express.Router();

router.post(
  '/create',
  async (req, res) => {
    try {
      const newLazyNFT = new LazyNFT({
        tokenID: req.body.tokenID,
        uri: req.body.uri,
        price: req.body.price,
        creator: req.body.creator,
        signature: req.body.signature
      });

      const lazyNFT = await newLazyNFT.save();

      res.json(lazyNFT);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post('/get', async (req, res) => {
  try {
    const lazyNFTs = await LazyNFT.find();
    
    res.json(lazyNFTs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/update', async (req, res) => {
  try {
    let nft = await LazyNFT.findOneAndUpdate({_id: req.body._id}, req.body, {
      new: true
    });
    res.json(nft)
    
    if (!nft) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
