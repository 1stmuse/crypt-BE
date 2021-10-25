const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT || 5050;
const jwt = require("jsonwebtoken");
const app = require("./app");
const Transaction = require("./models/transaction");
const User = require("./models/user.model");
const transport = require("./utils/mailer");
const { buyMail, sellMail, borrowMail, repayMail } = require("./utils/mail");

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected and running"))
  .catch((err) => console.log("error connecting", err));

mongoose.Promise = global.Promise;

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const mailOptions = {
  from: "olysegs@gmail.com", // Sender address
  // to: "rusland.kogan@gmail.com", // List of recipients
  to: "theakinnagbe@gmail.com",
  subject: "Transaction Initiated", // Subject line
  // text: "Hello People!, Welcome to Bacancy!", // Plain text body
};

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
  console.log("connected", socket.user);
  const id = socket.user;
  socket.join(id);

  io.to(id).emit("connected", "connected");

  socket.on("Buy-crypto", async (data) => {
    const payload = await User.findById(data.userId).select(
      "firstname lastname"
    );

    const values = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      ...data,
    };

    transport.sendMail(
      {
        ...mailOptions,
        html: buyMail(values),
        attachments: [
          {
            // use URL as an attachment
            filename: "prove.png",
            path: values.image,
          },
        ],
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("success", info);
          io.to(payload._id).emit(
            "buy-success",
            "Admin has been notified and will send the BTC to your address"
          );
        }
      }
    );
  });

  socket.on("Sell-crypto", async (data) => {
    const payload = await User.findById(data.userId).select(
      "firstname lastname"
    );

    const values = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      ...data,
    };

    transport.sendMail(
      {
        ...mailOptions,
        html: sellMail(values),
        attachments: [
          {
            // use URL as an attachment
            filename: "prove.png",
            path: values.image,
          },
        ],
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("success", info);
          io.to(payload._id).emit(
            "sell-success",
            "Admin has been notified and will send the Money to your bank account"
          );
        }
      }
    );
  });

  socket.on("Loan", async (data) => {
    const payload = await User.findById(data.userId);

    // const debt = +payload.debt;
    // const newDebt = debt + +data.cash_amount;

    // payload.debt = newDebt;
    // await payload.save();

    const values = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      ...data,
    };

    transport.sendMail(
      {
        ...mailOptions,
        html: borrowMail(values),
        attachments: [
          {
            // use URL as an attachment
            filename: "prove.png",
            path: values.image,
          },
        ],
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("success", info);
          io.to(payload._id).emit(
            "loan-success",
            "Admin has been notified and will send the Money to your bank account"
          );
        }
      }
    );
  });

  socket.on("Repay", async (data, callback) => {
    const payload = await User.findById(data.userId);

    const values = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      ...data,
    };

    transport.sendMail(
      {
        ...mailOptions,
        html: repayMail(values),
        attachments: [
          {
            // use URL as an attachment
            filename: "prove.png",
            path: values.image,
          },
        ],
      },
      (err, info) => {
        if (err) {
          console.log(err);
          callback(err, "could not complete transaction try again");
        } else {
          console.log("success", info);
          callback(
            null,
            "Admin has been notified and will send the deposited BTC to your address"
          );
        }
      }
    );
  });

  socket.on("resolve", async (data, callback) => {
    const transaction = await Transaction.findById(data._id);
    const user = await User.findById(data.userId);

    transaction.status = "settled";
    await transaction.save();

    if (data.type.toLowerCase() === "loan") {
      const debt = +user.debt;
      const newBal = debt - Number(data.cash_amount);
      // const newBalance = debt - loan;
      user.debt = newBal;
      await user.save();
      console.log(newBal);
      io.to(data.userId).emit(
        "repay-success",
        "Admin has sent the deposited collateral to your BTC address"
      );
      callback(null, "success");
      return;
    }

    if (data.type.toLowerCase() === "buy btc") {
      io.to(data.userId).emit(
        "buy-success",
        "Admin has sent the Crypto to your crypto address."
      );
      callback(null, "success");
      return;
    }

    if (data.type.toLowerCase() === "sell btc") {
      io.to(data.userId).emit(
        "sell-success",
        "Admin has sent the Money to your bank account. "
      );
      callback(null, "success");
      return;
    }
  });

  socket.on("accept", async (data, callback) => {
    const payload = await User.findById(data.userId);
    const trans = await Transaction.findById(data._id);

    const debt = +payload.debt;
    const newDebt = debt + +data.cash_amount;

    payload.debt = newDebt;
    trans.accepted = true;
    await trans.save();
    await payload.save();

    io.to(data.userId).emit(
      "loan-accept-success",
      "Admin has sent the Money to your bank account, transaction status will remail Pending untill you replay the loan "
    );
    callback(null, "success");
    return;
  });

  socket.on("disconnect", () => {
    // console.log('disconnected', socket.user)
  });
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));
