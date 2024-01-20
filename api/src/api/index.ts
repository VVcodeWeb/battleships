import cors from "cors";
import express from "express";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import consola from "consola";
import Room from "../models/Room";
import { WAITING_FOR_PLAYERS } from "shared/constants";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get("/generate-user-id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ userId: uuid() }));
});

app.post("/room/create", async (req, res) => {
  consola.info(req.body);
  const userId = req.body.userId;
  if (!userId) res.status(400).send();
  const roomId = uuid().substring(0, 8);
  const room = new Room({
    owner: { id: userId, ships: [] },
    guest: null,
    roomID: roomId,
    stage: WAITING_FOR_PLAYERS,
    gameLog: [],
  });
  room.print("Creating room: ");
  await room.save();
  res.status(201).send({ roomId });
});

export default app;
