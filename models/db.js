const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://micky:micky123@cluster0.ycodh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Database Connection Established!");
  })
  .catch((err) => console.log(err));
