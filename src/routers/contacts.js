import { Router } from "express";
import { createContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.post("/", ctrlWrapper(createContactController));

export default router;
