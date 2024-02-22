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
    body("email").isEmail().isString().notEmpty(),
    body("birth_date").isString().notEmpty(),
    body("location_id").isInt().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // validation by req body
      if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
      }
      const { first_name, last_name, email, birth_date, location_id } =
        req.body;

      // check location exists or not by id
      const findLocation = await prisma.location.findFirst({
        where: { id: location_id },
      });
      if (!findLocation) {
        return res.status(404).json({ error: { msg: "location not found" } });
      }

      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          birth_date: new Date(birth_date),
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
    body("first_name").isString().optional(),
    body("last_name").isString().optional(),
    body("email").isEmail().isString().optional(),
    body("birth_date").isString().optional(),
    body("location_id").isInt().optional(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // validation by req body
      if (!errors.isEmpty()) {
        return res.status(403).json({ errors: errors.array() });
      }
      const { first_name, last_name, email, birth_date, location_id } =
        req.body;

      // check user exists or not by id
      const findUser = await prisma.user.findFirst({
        where: { id: req.params.id },
      });
      if (!findUser) {
        return res.status(404).json({ error: { msg: "user not found" } });
      }

      // check location exists or not by id
      const findLocation = await prisma.location.findFirst({
        where: { id: location_id },
      });
      if (!findLocation) {
        return res.status(404).json({ error: { msg: "location not found" } });
      }

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          first_name,
          last_name,
          email,
          birth_date: new Date(birth_date),
          location_id,
        },
      });

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "internal server error" } });
    }
  }
);

// delete
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    // check user exists or not by id
    const findUser = await prisma.user.findFirst({
      where: { id: req.params.id },
    });
    if (!findUser) {
      return res.status(404).json({ error: { msg: "user not found" } });
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "internal server error" } });
  }
});

// get all
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});

    return res.status(200).json({ result: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "internal server error" } });
  }
});

export default router;
