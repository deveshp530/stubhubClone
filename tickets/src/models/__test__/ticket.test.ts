import { Ticket } from "../tickets";
import { app } from "../../app";

it("implements optimistic concurrency control", async () => {
  //create insatnce of ticket
  const ticket = Ticket.build({
    title: "fasdfds",
    price: 20,
    userId: "123",
  });

  //save tiket to db
  await ticket.save();

  //fetch ticket twice
  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  //2 different changes to tickets

  firstTicket!.set({ price: 12 });
  secondTicket!.set({ price: 15 });

  //save first fetched ticket
  await firstTicket!.save();

  //save second fetched ticket
  try {
    await secondTicket!.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this point");
});

it("increments version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "fasdfds",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
