const router = require('express').Router();
const User = require('../../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/', async(req, res) => {
  try {
    const {username, email} = req.body;
    const newUser = await User.create({username, email});
    res.json(newUser);
  } catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id})
      .select('-__v')
      .populate('thoughts')
      .populate('friends');

    res.json(user);
  } catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async(req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true
    });
    res.json(updatedUser);
  } catch(err) {
    res.status(500).json(err);
  }
})

router.delete('/:id', async(req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      _id: req.params.id
    });
    res.json(deletedUser);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {_id: req.params.userId},
      {$addToSet: {friends: req.params.friendId}},
      {new: true}
    );

    res.json(user);
  } catch(err) {
    res.status(500).json(err);
  }
})

router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {_id: req.params.userId},
      {$pull: {friends: req.params.friendId}},
      {new: true}
    );
  
    res.json(user);
  } catch(err) {
    res.status(500).json(err);
  }
})


module.exports = router;