import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === contactId);
  return contact || null;
}

export async function addContact(name, email, phone) {
  const data = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return newContact;
}

export async function removeContact(contactId) {
  let data = await listContacts();
  const removedContact = data.find((item) => item.id === contactId);
  data = data.filter((item) => item.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return removedContact || null;
}
