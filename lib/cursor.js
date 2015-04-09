(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');


    var Cursor = function(cursor) {
        this.underlying = cursor;
    };


    Cursor.prototype.getMethod = function(methodName) {
        var self = this;
        var fn = generatorify(this.underlying[methodName]);
        return function*() {
            fn.apply(self.underlying, arguments);
        };
    };


    var methods = [
        "limit",
        "next",
        "skip",
        "sort"
    ];
    methods.forEach(function(methodName) {
        Cursor.prototype[method] = getMethod(methodName);
    });


    module.exports = Cursor;

}).call(this);
