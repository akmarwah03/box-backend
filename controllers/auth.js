const UserModel = require("../models/User");
const BoxSDK = require("box-node-sdk");

const config = require("../privateKey/config.json");

const sdk = BoxSDK.getPreconfiguredInstance(config);
const client = sdk.getAppAuthClient("enterprise");

exports.signupUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  client.enterprise
    .addUser(email, name, {
      role: client.enterprise.userRoles.EDITOR,
    })
    .then((createdUser) => {
      const userId = createdUser.id;
      const user = new UserModel({
        email,
        password,
        userId,
        name,
      });
      return user.save((result) => {
        res.status(200).json({
          message:
            "Sucess, set your box password using your email before login",
          userId,
        });
      });
    })
    .catch((error) => {
      res.status(400).json({ message: "Email already used" });
    });
};

exports.signinUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  UserModel.findOne({ email })
    .then(async (user) => {
      if (!user || user.password != password) {
        return res.status(403).json({
          message: "Failed",
          error: "Wrong credentials",
        });
      }
      const token = await sdk.getAppUserTokens(user.userId);
      res.status(200).json({ message: "Sucess", token, userId: user.userId });
    })
    .catch((error) => {
      res.status(403).json({ message: "Password reset required" });
    });
};
