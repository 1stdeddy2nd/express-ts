import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../prisma/client";

const router = express.Router();

// create
router.post(
  "/",
  [
    body("id").isEmpty(),
    body("first_name").isString().notEmpty(),
    body("last_name").isString().notEmpty(),
    body("birth_date").isString().notEmpty(),
    body("location_id").isInt().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // validation by req body
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { first_name, last_name, birth_date, location_id } = req.body;

      // check location exists or not by id
      const findLocation = await prisma.location.findFirst({
        where: { id: location_id },
      });
      if (!findLocation) {
        return res.status(403).json({ error: { msg: "location not found" } });
      }

      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          birth_date,
          location_id,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "internal server error" } });
    }
  }
);

// update
router.put(
  "/:id",
  [
    body("first_name").isString().notEmpty(),
    body("last_name").isString().notEmpty(),
    body("birth_date").isString().notEmpty(),
    body("location_id").isInt().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // validation by req body
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { first_name, last_name, birth_date, location_id } = req.body;

      // check user exists or not by id

      // check location exists or not by id
      const findLocation = await prisma.location.findFirst({
        where: { id: location_id },
      });
      if (!findLocation) {
        return res.status(403).json({ error: { msg: "location not found" } });
      }

      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          birth_date,
          location_id,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "internal server error" } });
    }
  }
);

export default router;
