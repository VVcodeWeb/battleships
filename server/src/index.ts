import { config } from "./config";
import { socketController } from "./socket";

const io = socketController();
io.listen(config.IO_PORT);
