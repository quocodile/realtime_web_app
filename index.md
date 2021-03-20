<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.socket.io/socket.io-3.0.0.js"></script>
</head>
<body>
  <div id="main_container">
  <input id="message_box" type="text"/>
  <button onclick="send_message()">Send Message</button>
  <div id="display_messages"></div>
  </div>
<style>
  #main_container {
    width: 350px;
    border: 1px solid black;
  }
  #message_box {
    margin: 10px;
  }
  .message {
    margin: 10px;
  } 
</style>
<script>
  var message_box = document.getElementById("message_box");
  var display_messages = document.getElementById("display_messages");
  var socket = io("ws://localhost:8080");  

  socket.on("connect", function() {
    console.log("connected");
  });

  socket.on("allMessages", function(allMessages) {
    var messages_html = "";
    var allMessages = allMessages["all_messages"]
    for (var i = 0; i < allMessages.length; i++) {
      messages_html += "<div class='message'>"; 
      messages_html += allMessages[i];
      messages_html += "</div>";
    }
    display_messages.innerHTML = messages_html;
  }); 
  
  function send_message() {
    var message = message_box.value;
    message_box.value = "";
    socket.emit("newMessage", {
      message: message
    });     
  }
</script>
</body>
</html>