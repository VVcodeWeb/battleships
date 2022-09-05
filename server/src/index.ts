import express from "express";
import path from "path";

const app = express();
const PORT = 8080;
app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../client/public", "index.html"));
});

app.listen(PORT, () => console.log("started"));
