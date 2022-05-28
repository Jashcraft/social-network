const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');


router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/', async(req, res) => {
  try {
    const newThought = await Thought.create({...req.body});
    const updatedUser = await User.findOneAndUpdate(
      {_id: req.body.userId},
      {$push: {thoughts: newThought._id}},
      {new: true}
    );
    res.json(updatedUser);
  } catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const thought = await Thought.findOne({_id: req.params.id});
    res.json(thought);
  } catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async(req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );
    res.json(updatedThought);
  } catch(err) {
    res.status(500).json(err);
  }
})

router.delete('/:id', async(req, res) => {
  try {
    await Thought.findOneAndDelete(
      {_id: req.params.id}
    );

    const user = await User.findOneAndUpdate(
      {thoughts: req.params.id},
      {$pull: {thoughts: req.params.id}},
      {new: true}
    )
    res.json(user);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/:thoughtId/reactions', async(req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$addToSet: {reactions: req.body}}
    );
  
    res.json(updatedThought);
  } catch(err) {
    res.status(500).json(err);
  }
})

router.delete('/:thoughtId/reactions/:reactionId', async(req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$pull: {reactions: {reactionId: req.params.reactionId}}}
    );
    res.json(updatedThought);
  } catch(err) {
    res.status(500).json(err);
  }
})


module.exports = router;