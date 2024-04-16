const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch {
    return res.status(500).json({ error: err.message });
  }
}

exports.register = async (req, res, next) => {
  try {
      // Check if user with the same email or username already exists
      const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
      if (existingUser) {
          return res.status(400).json({ error: 'User with this email or username already exists' });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
      });
      const savedUser = await user.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token: token, user: savedUser });
  } catch (err) {
      console.log(err)
      return next(err);
  }
}
exports.login = function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) throw err;
      if (!user) res.status(400).json({ error: 'No user exists' });
      else {
        req.logIn(user, (err) => {
          if (err) {
            res.status(500).json({ message: 'Failed to log in' });
            return;
          }
          console.log(user)
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          res.json({ token: token, user: user});
        });
      }
    })(req, res, next);
  }

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send('Logged out successfully');
  });
};

exports.isRegistered = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        User.findById(decoded.id);
    });
    return res.json({ isRegistered: true });
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await User.find({ _id: { $in: user.friends } });
    return res.json(friends);
  } catch {
    return res.status(500).json({ message: 'Failed to get friends' });
  }
}

exports.addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);
    
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i] == friend._id) {
        return res.status(400).json({ message: 'Friend already exists' });
      }
    }

    user.friends.push(friend._id);
    await user.save();
    return res.json(friend);
  } catch {
    return res.status(500).json({ message: 'Failed to add a friend' });
  }
}

exports.deleteFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends');
    const friend = await User.findById(req.body.friendId);

    user.friends = user.friends.filter(f => f._id.toString() !== friend._id.toString());
    console.log(user.friends);
    await user.save();
    return res.json(user);
  } catch {
    return res.status(500).json({ message: 'Failed to delete a friend' });
  }
}

exports.getFriend = async (req, res) => {
  try {
    const friend = await User.findById(req.params.id);
    return res.json(friend);
  } catch {
    return res.status(500).json({ message: 'Failed to get a friend' });
  }
}