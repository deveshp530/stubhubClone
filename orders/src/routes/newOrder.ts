import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@stubhubclone/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //Find ticket user is trying to order in db
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //make sure ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //calculate an expiration date

    //build order and save to db

    //publish event order was created
    res.send({});
  }
);

export { router as newOrderRouter };
