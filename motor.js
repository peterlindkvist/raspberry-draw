function Motor(stepPin, dirPin, enablePin){
    this.stepPin = stepPin;
    this.dirPin = dirPin;
    this.enablePin = enablePin;
    this.gpio = require("pi-gpio");
    this.stepTime = (new Date()).getTime();

    //this.open(true);
}

Motor.prototype.step = function(steps, delay, callback){
    var starttime = (new Date()).getTime();
    var deltatime = starttime - this.stepTime;
    this.stepTime = starttime;

    var _this = this, gpio = this.gpio, dir = steps < 0 ? 0 : 1;
    gpio.write(_this.dirPin, dir);
    //console.log("step", steps, delay, starttime, deltatime);

    gpio.write(_this.stepPin, 1, function(err) {
//        setTimeout(function(){
            gpio.write(_this.stepPin, 0, function() {
                var exectime = (new Date()).getTime() - starttime;
                //setTimeout(function(){
                    if(Math.abs(steps) > 0){
                        _this.step(steps - (dir ? 1 : -1), delay, callback);
                    } else {
                        callback();
                    }
                //}, Math.max(1, delay - exectime));
            });
//        }, 1);
    });
};

Motor.prototype.open = function(open, callback){
    if(open){
        this.gpio.open(this.stepPin, "output");
        this.gpio.open(this.dirPin, "output");
        this.gpio.open(this.enablePin, "output", callback);
    } else {
        this.gpio.close(this.stepPin);
        this.gpio.close(this.dirPin);
        this.gpio.close(this.enablePin, callback);
    }
};

Motor.prototype.enable = function(enable, callback){
    this.gpio.write(this.enablePin, enable ? 0 : 1, callback);
};

Motor.prototype.exec = function(data, callback){
    console.log("exec", data, !!callback);
    var gpio = this.gpio, _this = this;
    switch (data.type){
        case 'enable':
            this.enable(data.enable, callback);
            break;
        case 'write':
            gpio.write(data.pin, data.val, callback);
            break;
        case 'step':
            _this.step(data.steps, data.delay, callback);
            break;
        case 'open':
            _this.open(true, callback);
            break;
        case 'handshake':
            if(callback){
                callback("nothing");
            }
            break;
        case 'close':
            _this.open(false, callback);
            break;

    }

};

module.exports = Motor;