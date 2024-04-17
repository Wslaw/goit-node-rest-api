import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";
import "dotenv/config";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";


const { JWT_SECRET, PROJECT_URL } = process.env;

export const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email, {  d: "identicon" });
  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const newUser = await authServices.register({
    ...req.body,
    avatarURL,
    password: hashPassword,
    verificationToken,
  });
  if (!newUser) {
    throw HttpError(404, "Not found");
  };
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

export const verify = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "Email not found or already verify");
  }

  await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: "" });

  res.json({
    message: "Verification successful",
  });
});

export const resendVerify = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification already verify");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send again",
  });
}); 

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  };

   if (!user.verify) {
     throw HttpError(401, "Email not verify");
  };

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id, subscription, avatarURL } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });
  res.json({
    token,
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
});

export const getCurrent = ctrlWrapper(async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({ email, subscription, avatarURL });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });
  res.status(204).json({
    message: "No Content",
  });
});

export const updateAvatar = ctrlWrapper(async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const { _id, email } = req.user;
  const { path: oldPath, filename } = req.file;

  Jimp.read(oldPath, (err, img) => {
    if (err) throw err;
    img.resize(250, 250);
  });

  const newFilename = `${email}_${filename}`;
  const newPath = path.join(avatarPath, newFilename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", newFilename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
});