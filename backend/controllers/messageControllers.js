const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const sendMesssage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("no Data passed");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(
      { _id: req.body.chatId },
      {
        latestMessage: message,
      }
    );
    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});
const AllMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (err) {
    throw new Error(err.message);
  }
});
module.exports = { sendMesssage, AllMessages };
