/*
 * jQuery Perfect Edit Inplace
 * Copyright (c) 2009 John Boxall (johnboxall.ca)
 * Licensed under the MIT license.
 */
;(function($) {

$.fn.pie = function(options) {

var defaults = {
    class: '',                     // Class to apply to the inplace input.
    name: 'id',                    // Attribute used to name the inplace input.
    submit: console.log,           // Function to be called when inplace input is submitted.
    event: 'click',                // Event that triggers the inplace input.
    map: function(x) {return x;},  // Function that returns the element to be edited.
};

var s = $.extend(defaults, options);

return this.each(function() {
    var self = s.map(this);

    $(this).bind(s.event, function(e) {
        if (self.editing)
            return;
        
        self.editing = true;
        self.revert = $.trim($(self).html());
        $(self).html('');


        console.log(self);
        console.log(s.name)
        console.log($(self).attr(s.name));


        var form = $("<form />"),
            input = $('<input />');
        $(self).append(form);
        input.val(self.revert)
             .attr("name", $(self).attr(s.name))
             .addClass(s.class)
             .appendTo(form)
             .focus();
        
        input.keydown(function(e) {
            if (e.keyCode == 27) {
                e.preventDefault();
                reset();   
            }
        });

        input.blur(function(e) {
            submit();
        });
        
        form.submit(function(e) {
            e.preventDefault();
            submit();
        });
        
        var reset = function() {
            self.editing = false;        
            $(self).html(self.revert);
        };
        
        var submit = function() {
            if (self.revert != input.val()) {
                self.revert = input.val();            
                s.submit(input.get(0));
            }
            reset();
        };       
    });
});

};

})(jQuery);