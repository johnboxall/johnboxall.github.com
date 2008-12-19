// Mouse Class tracks the mouse acceleration.
var MouseY = {

    init: function(context) {
        var self = this;
        self._context = context || window
        self._down = false;
        self._now = 0;
        self._last = 0;
        self._offset = 0;
        self._timer = 0;
        self._acceleration = 0;

        // Mouse event listeners.
        $(self._context).mousedown(function() {self._down = true;});
        $(self._context).mouseup(function() {self._down = false;});
        $(self._context).mousemove(function(e) {self.move(e);});
    },
    
    isDown: function(e) {
        return this._down;
    },
    
    move: function(e) {
        var self = this;

        // Only drag if mouse is down.
        if (self.isDown()) {
            self._timer++;
            self._last = self._now;
            self._now = e.clientY + window.document.body.scrollTop;
            self._offset = self._now - self._last;
            self._acceleration = self._offset / self._timer;
        } else {
            self.reset();
        }
    },
    
    reset: function() {
        this._offset = 0;
        this._acceleration = 0;
        this._timer = 0;
    }
};

// iPhone class controls the iframe position.
var iPhone = {

    init: function() {
        this.frame = $('#iframe').get(0);
        // When the iframe is loaded call the iframe funcion.
        $(this.frame).bind("load", function() {this.iframe()});

        // Keep track of the current window acceleration / velocity.
        this._windowAcceleration = 0;
        this._windowVelocity = 0;
    },
    
    iframe: function() {
        // Add event listeners to the iframe.Control the scrolling of this mother.
        var self = this;  
        var frame = self.frame;
        self.window = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;

        // Startup the mouse - pass in the context of the iframe window.
        MouseY.init(self.window);
        
        // Start the timer to track the mouse acceleration and update the screen.
        self.mouseTimer = setInterval(function() {
            iPhone.update(MouseY._acceleration);
            MouseY.reset();
        }, 20);
    },
    
    update: function(acceleration) {
        this._windowAcceleration = acceleration;
        this._windowVelocity = (this._windowVelocity + (this._windowAcceleration / 5)) * 0.96;

        var posY = iPhone.frame.contentWindow.pageYOffset + this._windowVelocity;
        // Keep the screen in bounds
        if (posY < 0 || posY > iPhone.frame.contentWindow.outerHeight) {
            this._windowVelocity *= -0.5;
        }

        iPhone.frame.contentWindow.scrollTo(0, posY);
    }
};


$(function() {iPhone.init();});