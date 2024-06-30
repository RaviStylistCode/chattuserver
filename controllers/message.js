import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { io, getReceiverId } from "../app.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const recieverId = req.params.id;
    const { message } = req.body;
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }
    // console.log(gotConversation);

    const newMessage = await Message.create({ senderId, recieverId, message });

    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save()]);

    const receiverId = getReceiverId(recieverId);
    if (receiverId) {
      io.to(receiverId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      message: "Message created successfully",
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const GetMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const recieverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    }).populate("messages");

    return res.status(200).json({
      success: true,
      message: conversation?.messages,
    });
  } catch (error) {
    console.log(error);
  }
};
