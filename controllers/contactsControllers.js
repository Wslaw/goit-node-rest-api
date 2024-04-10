import { listContacts, countContacts, getContactByFilter, addContact, removeContact, upgradeContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";

const avatarPath = path.resolve("public", "avatars");

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const filter = favorite ? { $and: [{ owner }, { favorite }] } : { owner };

  const result = await listContacts(filter, { skip, limit });
  const total = await countContacts({ owner });
  if (!result) {
    throw HttpError(404, `Contacts not found`);
  }
  res.json({
    result,
    total,
  });
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await getContactByFilter({ owner, _id: id });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.status(200).json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await removeContact({ owner, _id: id });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.status(200).json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);

  await fs.rename(oldPath, newPath);
  const avatar = path.join("public", "avatars", filename);
  const result = await addContact({ ...req.body, avatar, owner });
  if (!result) {
    throw HttpError(400);
  }
  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await upgradeContact({ owner, _id: id }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.status(200).json(result);
});

export const updateStatusContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const favoredContact = await upgradeContact({ owner, _id: id }, req.body);
  if (!favoredContact) {
    throw HttpError(404);
  }
  res.status(200).json(favoredContact);
});
