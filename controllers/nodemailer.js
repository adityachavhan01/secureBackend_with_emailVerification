const nodemailer = require("nodemailer");

async function test() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "rohanchavhan121212@gmail.com",
      pass: "arhflkrlxchuapbc",
    },
  });

  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (error) {
    console.log("Error:", error);
  }
}

test();
