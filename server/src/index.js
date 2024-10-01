import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import { fetchSerialPortData } from "./serialPort.js";

connectDB()
.then(() => {
  fetchSerialPortData()
  app.listen(3000,() => {
    console.log(`Server listening at port 3000`)
  })
})


