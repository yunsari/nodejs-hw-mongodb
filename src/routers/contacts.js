import { Router } from "express";
import {
  createContactController,
  getAllContactsController,
  deleteContactController,
  updateContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";

const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));

router.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);


router.patch(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
