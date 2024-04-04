import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, setting = {}) => Contact.find(filter, "-createdAt -updatedAt", setting).populate(
  "owner", "name email"
);

export const countContacts = (filter) => Contact.countDocuments(filter);


export const addContact = (data) => Contact.create(data);

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);

export const upgradeContact = (filter, data) => Contact.findOneAndUpdate(filter, data);

// export const updateStatusById = (id, data) => Contact.findByIdAndUpdate(id, data);
