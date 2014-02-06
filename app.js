var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , path = require('path');


var motorConstructor = require("./motor.js");
var motors = [];
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.TEST_PORT || 8080);
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

motors[0] = new motorConstructor(12, 11, 18);
motors[1] = new motorConstructor(16, 15, 18);

//Routes
app.get('/motor', function (req, res) {
    console.log("start3");
    //var motor = new motorConstructor(18, 16);
    res.sendfile(__dirname + '/public/index.html');

//    motor1.run(10, function(){
//        console.log("run done!")
//    });

});



io.sockets.on('connection', function (socket) {

    socket.on('motor', function (data, callback) {
        ready = 0;
        motors[0].enable(true, function(){
            for(var i = 0;i< motors.length;i++){
                motors[i].exec(data[i], function(ret){
                    ready ++;
                    if(ready == 2 && callback){
                        motors[0].enable(false, function(){
                            console.log("DONE!");
                            callback(ret);
                        });
                    }
                });
            }
        })
    });
});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});