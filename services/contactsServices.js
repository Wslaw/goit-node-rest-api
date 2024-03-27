import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const addContact = (data) => Contact.create(data);

export const getContactById = (id) => Contact.findById(id);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const upgradeContact = (id, data) => Contact.findByIdAndUpdate(id, data);

// export const updateStatusById = (id, data) => Contact.findByIdAndUpdate(id, data);
