import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res, next) => {
  try {
    res.status(200).json(await contactsServices.listContacts());
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json({ message: "Delete success", Deleted_contact:result });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    // const { name, email, phone } = req.body;
    const result = await contactsServices.addContact(req.body);
    if (!result) {
      throw HttpError(400);
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.upgradeContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const favoredContact = await contactsServices.upgradeContact(id, req.body, {
      new: true,
    });
    if (!favoredContact) {
      throw HttpError(404);
    }
    res.status(200).json(favoredContact);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
