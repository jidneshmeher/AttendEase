import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import { fetchSerialPortData } from "./serialPort.js";
import { createAdmin } from "./services/admin.service.js";

connectDB()
.then(() => {
  createAdmin()
  fetchSerialPortData()
  app.listen(3000,() => {
    console.log(`Server listening at port 3000`)
  })
})
.catch ((err) => {
  console.error("Error starting server:", err);
})