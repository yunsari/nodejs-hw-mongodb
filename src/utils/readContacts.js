import fs from "fs/promises";
import path from "path";

const dbPath = path.resolve("src/db/db.json");

export const readContacts = async () => {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
};
