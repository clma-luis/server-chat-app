const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        image: msg.message.image,
        time: msg.createdAt
      };
    });
    
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, image } = req.body;
    const data = await Messages.create({
      message: { text: message, image: image },
      users: [from, to],
      sender: from,
  
    });

    if (data) return res.json({ msg: "El mensaje fue agregado satisfactoriamente." });
    else return res.json({ msg: "Ha fallado al agregar el mensaje en la base de datos" });
  } catch (ex) {
    next(ex);
  }
};
