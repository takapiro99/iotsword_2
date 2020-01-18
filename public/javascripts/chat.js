//make conection

var socket = io.connect("http://153.126.160.230:3000");

// Query DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

//emit events
btn.addEventListener("click",function(){
    socket.emit("chat",{
        message: message.value,
        handle: handle.value
    })
})

message.addEventListener("keypress",function(){
    socket.emit("typing",handle.value);

})

//Listen for events
socket.on("chat",function(data){
    feedback.innerHTML = ""
    output.innerHTML += "<p><strong>"+data.handle+"</strong>: "+data.message+"</p>"
});

