const Message = require("../model/messageModel");
const getAllMessage = async (req, res) => {
  try {
    const AllMessage = await Message.find({});
    res.json(AllMessage);
  } catch (error) {
    throw new Error(error);
  }
};
const getMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const getMessage = await Message.findById(id);
    res.json(getMessage);
  } catch (error) {
    throw new Error(error);
  }
};
const createMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;
  // return console.log(req.body);
  try {
    const createMessage = await new Message({
      sender: sender,
      receiver: receiver,
      content: content,
    });

    createMessage.save();
    res.json({
      createMessage,
      msg: "create message with success",
    });
  } catch (error) {
    throw new Error(error);
  }
};
const putMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const updateMsg = await Message.findByIdAndUpdate(
      id,
      {
        $set: {
          content: content,
        },
      },
      { new: true, runValidators: true }
    );
    res.json(updateMsg);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteMessage = await Message.findByIdAndDelete(id);
    res.json(deleteMessage);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getAllMessage,
  getMessage,
  createMessage,
  putMessage,
  deleteMessage,
};
