import express from "express";
import {createContact} from "../controllers/contactsControllers.js";
import { deleteContact } from "../controllers/contactsControllers.js";
import {getAllContacts} from "../controllers/contactsControllers.js";
import {getOneContact} from "../controllers/contactsControllers.js";
import {updateContact} from "../controllers/contactsControllers.js";
import {
  // getAllContacts,
  // getOneContact,
  // deleteContact,
  // createContact,
  // updateContact,
} from "../controllers/contactsControllers.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

export default contactsRouter;
