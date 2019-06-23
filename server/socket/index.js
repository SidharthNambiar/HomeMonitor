// const router = require('express').Router()
// // import module from "../api/devices"

// const getApiAndEmit = async socket => {
//   try {
//     const res = await router.get('/api/devices')
//     console.log(res)
//     socket.emit("FromAPI", res.data);
//   } catch (error) {
//     console.error(`Error: ${error.code}`);
//   }
// };

let interval

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    // if (interval) {
    //   clearInterval(interval);
    // }
    // interval = setInterval(() => getApiAndEmit(socket), 3000);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
