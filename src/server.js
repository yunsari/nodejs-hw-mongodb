import { getAllContacts, getContactsById } from "./services/contacts.js";
import express from "express";
import pino from "pino-http";
import cors from "cors";

import { env } from "./utils/env.js";

const PORT = Number(env("PORT", "3000"));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
  );

  app.get("/contacts", async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      data: contacts,
    });
  });

  app.get("/contacts/:contactId", async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);

    if (!contact) {
      res.status(404).json({
        message: "contact not found!",
      });
      return;
    }

    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
