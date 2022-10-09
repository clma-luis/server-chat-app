const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData)
      return res.json({
        msg: "Usuario o contraseña incorrecta",
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid)
      return res.json({
        msg: "Usuario o contraseña incorrecta",
        status: false,
      });
    const user = {
      sub: userData.id,
      role: userData.role,
      username: userData.username,
      isAvatarImageSet: userData.isAvatarImageSet,
      avatarImage: userData.avatarImage,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    

    return res.json({ status: true, user, token });
  } catch (ex) {
    next(ex);
  }
};

module.exports.LoginExternalUser = async (req, res, next) => {
  try {
    const { username, externalId } = req.body;
    const checkExternalId = await User.findOne({ externalId });

    if (checkExternalId) {
      const payload = {
        sub: checkExternalId.id,
        role: checkExternalId.role,
        username: checkExternalId.username,
        isAvatarImageSet: checkExternalId.isAvatarImageSet,
        avatarImage: checkExternalId.avatarImage,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      return res.json({ status: true, url: `http://localhost:3000?publicKey=${token}`});
    }
    if (checkExternalId === null) {
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);
      var randomColorDos = Math.floor(Math.random() * 16777215).toString(16);
    
      const user = await User.create({
        username,
        role: "employee",
        externalId,
        isAvatarImageSet: true,
        email: externalId,
        avatarImage: `https://ui-avatars.com/api/?name=${username}&background=${randomColor}&color=${randomColorDos}&size=128`,
      });

      const payload = {
        sub: user.id,
        role: user.role,
        username: user.username,
        isAvatarImageSet: user.isAvatarImageSet,
        avatarImage: user.avatarImage,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      return res.json({ status: true, url: `http://localhost:3000?publicKey=${token}`});
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username ya está en uso", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck) return res.json({ msg: "Correo ya en uso", status: false });
    if (!emailCheck) {
      const hashedPassword = await bcrypt.hash(password, 10);
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);
      var randomColorDos = Math.floor(Math.random() * 16777215).toString(16);
      const user = await User.create({
        email,
        role: "admin",
        username,
        password: hashedPassword,
        isAvatarImageSet: true,
        avatarImage: `https://ui-avatars.com/api/?name=${username}&background=${randomColor}&color=${randomColorDos}&size=128`,
      });
      delete user.password;
      return res.json({ status: true, user });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "role",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};