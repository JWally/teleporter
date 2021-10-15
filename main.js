const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const rooms = {};

wss.on('connection', function connection(ws,req) {
    
    console.log("----------");
    ws.____room = req.url;
    ws.____id = req.headers["sec-websocket-key"];
    ws.____ip = req.socket.remoteAddress;
    
    
    //
    // Create a room if none exists
    //
    if(!rooms[req.url]){
        rooms[req.url] = {};
    }
    
    //
    // And put our websocket in it...
    //
    rooms[req.url][req.headers["sec-websocket-key"]] = ws;
    
    
    //
    // When the web-socket emits a message, tell only the people
    // in the same room about it...
    //

    ws.on("message", (message) => {
        for(client in rooms[ws.____room]){
            if(client !== ws.____id){
                rooms[ws.____room][client].send(message);
            }
        }
    })
    
    
    
  /*
  // Tell teh other clients that somebody new has entered
  wss.clients.forEach(function each(client){
      if (client.readyState === WebSocket.OPEN) {
        client.send("CLIENT ON");
      } else {
        client.terminate();
      }
  })
    
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      } else {
        client.terminate();
      }
    });
  });
  */
});