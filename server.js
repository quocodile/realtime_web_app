socketIO = require("socket.io");
const http = require("https")
const mongodb = require("mongodb");
const config = require("./config");

const mongoClient = mongodb.MongoClient; 
const server = http.createServer();
const io = socketIO(server,  {
  cors: { origin: "*" }
});

/*the server forms a connection with a user*/
io.on('connection', (socket) => {
  delete_all_messages();
  socket.on("newMessage", (message) => {
    var message = message["message"]
    add_message_to_db(message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}); 

server.listen(3100);

function get_mongo_client() {
  const username = config.username();
  const password = config.password();
  const url =  'mongodb+srv://' + username + ':' + password + '@cluster0.orpr1.mongodb.net/first_database?retryWrites=true&w=majority';
  const client = new mongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  return client;
}

async function add_message_to_db(message) {
   const client = get_mongo_client();
   //connect to the database
   await client.connect((err) => {
     if (err) throw err;
     const db = client.db("realtime_chat_app");
     const collection = db.collection("temp");
     var message_data = {message : message}   
     collection.insertOne(message_data, function(err, res) {
       if (err) throw err;
       console.log("Inserted message");
       client.close();
       get_all_messages_from_db(io);
     });
   });
}

function get_all_messages_from_db(io) { 
  const client = get_mongo_client();
  client.connect((err) => {
    if (err) throw err;
    const db = client.db("realtime_chat_app");
    const collection = db.collection("temp");
    const all_messages = []
    collection.find({}).toArray((err, result) => {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        all_messages.push(result[i]["message"]);
      }
      io.emit("allMessages", {
        all_messages: all_messages 
      });
    });
  });
}

function delete_all_messages() {
  const client = get_mongo_client();
  client.connect((err) => {
    if (err) throw err;
    const db = client.db("realtime_chat_app");
    const collection = db.collection("temp");
    collection.deleteMany({}, (err) => {
      if (err) throw err;
    });   
  }); 
}







