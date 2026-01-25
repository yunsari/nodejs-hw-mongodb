import fs from "fs/promises";
import path from "path";

const dbPath = path.resolve("src/db/db.json");

export const writeContacts = async (contacts) => {
  await fs.writeFile(dbPath, JSON.stringify(contacts, null, 2));
};
