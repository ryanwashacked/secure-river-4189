window.onload = function() {
 
    var messages = [];
    var socket = io.connect();
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
 
    socket.on('message', function (data) {
        if(data.message) {

            content.innerHTML += '<b>' + data.username + ': <b>';
            content.innerHTML +=  data.message + '<br />';
        } 
        else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('load old msgs', function(docs){
    for (var i = docs.length - 1; i >= 0 ; i--){
        displayMsg(docs[i]);
    }
});

    function displayMsg(data){
        content.innerHTML += '<b>' + data.username + ': <b>';
        content.innerHTML +=  data.msg + '<br />';
    }
 
    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            field.value = '';
        }
    };
 
}