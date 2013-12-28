var express = require("express");
var app = express();
var port = 3700;
var mongoose = require('mongoose');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/chat';

mongoose.connect(uristring, function(err){
	if(err){
		console.log(err)
	}
	else{
		console.log('Connected to mongodb!');
	}
});

var chatSchema = mongoose.Schema({
	username: String,
	msg:  String,
	created_at: {type: Date, default:Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
 
app.get("/", function(req, res){
    res.send("It works!");
    console.log("Got a connection");
});

app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(process.env.PORT || port));

io.sockets.on('connection', function (socket) {
    socket.emit('welcome message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
 
    	var newMsg = new Chat({username: data.username, msg: data.message});
    	newMsg.save(function(err){
    		if (err) throw err;
    		 io.sockets.emit('message', data);
    	})
       
    });

    var query = Chat.find({});

    query.sort('-created_at').limit(8).exec(function(err,docs){
    	if(err) throw err;

    	socket.emit('load old msgs', docs);
    });

    
});




console.log("Listening on port :" + process.env.PORT || port);