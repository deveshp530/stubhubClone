import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@stubhubclone/common";

import { newOrderRouter } from "./routes/newOrder";
import { showOrderRouter } from "./routes/showOrder";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/deleteOrder";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
