const Chat = require('../models/chat');
const io  = require('../app');
const User = require('../models/user');

exports.getMessages = async (req, res) => {
  try {
    const from = req.params.userId;
    const to = req.params.friendId;
    const chat = await Chat.findOne({users: { $all: [from, to] }}).populate('messages').exec();
    return res.json(chat);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
