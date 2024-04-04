import { listContacts, getContactById, addContact, removeContact, upgradeContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
// import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";



export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  
    res.status(200).json(await listContacts());
  
});

export const getOneContact = (async (req, res, next) => {
  
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  
});

export const deleteContact = ctrlWrapper(async (req, res, next) => {
  
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  
});

export const createContact = ctrlWrapper(async (req, res, next) => {
 
    const { name, email, phone } = req.body;
    const result = await addContact(name, email, phone);
    res.status(201).json(result);
 
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
 
    const { id } = req.params;
    const result = await upgradeContact(id, req.body);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  
});
