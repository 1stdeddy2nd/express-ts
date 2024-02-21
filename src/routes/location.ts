import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../../prisma/client";

const router = express.Router();

// create
router.post(
  "/",
  [
    body("id").isEmpty(),
    body("name").isString().notEmpty(),
    body("timezone").isString().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // validation by req body
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, timezone } = req.body;

      // check location name must be unique
      const findLocation = await prisma.location.findFirst({
        where: { name },
      });
      if (findLocation) {
        return res
          .status(403)
          .json({ error: { msg: "location name must be unique" } });
      }

      const location = await prisma.location.create({
        data: {
          name,
          timezone,
        },
      });

      return res.status(201).json(location);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "internal server error" } });
    }
  }
);

// update
router.put(
  "/:id",
  [body("name").isString(), body("timezone").isString()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // validation by req body
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, timezone } = req.body;

      // check location exists or not by id
      const locationById = await prisma.location.findFirst({
        where: { id: Number(req.params.id) },
      });
      if (!locationById) {
        return res.status(403).json({ error: { msg: "location not found" } });
      }

      // check location name must be unique
      const locationByName = await prisma.location.findFirst({
        where: { name },
      });
      if (locationByName) {
        return res
          .status(403)
          .json({ error: { msg: "location name must be unique" } });
      }

      // update it
      const location = await prisma.location.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          timezone,
        },
      });

      return res.status(200).json(location);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: { msg: "internal server error" } });
    }
  }
);

// update
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    // check location exists or not by id
    const findLocation = await prisma.location.findFirst({
      where: { id: Number(req.params.id) },
    });
    if (!findLocation) {
      return res.status(403).json({ error: { msg: "location not found" } });
    }

    // delete it
    await prisma.location.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { msg: "internal server error" } });
  }
});

// get all
router.get("/", async (req: Request, res: Response) => {
  const locations = await prisma.location.findMany();
  return res.status(200).json({ result: locations });
});

export default router;
