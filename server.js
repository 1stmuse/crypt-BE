const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT || 5050;
const jwt = require("jsonwebtoken");
const app = require("./app");

mongoose
  .connect("mongodb://localhost/chatty", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("error connecting", err));

mongoose.Promise = global.Promise;

const server = http.createServer(app);

const io = require("socket.io").listen(server);
io.use(async (socket, next) => {
  const token = socket.handshake.query.id;
  try {
    const userId = jwt.verify(token, process.env.TOKEN_SECRET);

    socket.user = userId;
    next();
  } catch (error) {
    next();
    // console.log('this error', error)
  }
});

io.on("connection", (socket) => {
  // console.log('connected', socket.user)
  socket.emit("connect", (socket.user, "from BE"));

  socket.on("disconnect", () => {
    // console.log('disconnected', socket.user)
  });
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));
