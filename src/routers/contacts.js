import { Router } from "express";
import {
  createContactController,
  getAllContactsController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));
router.post("/", ctrlWrapper(createContactController));

export default router;
