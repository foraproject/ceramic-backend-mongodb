(function() {

    "use strict";

    var NativeComponent = require("mongodb").Cursor;
    var utils = require("./utils");

    var Cursor = function(cursor) {
        this.underlying = cursor;
    };

    var methods = [
        "limit",
        "next",
        "skip",
        "sort",
        "toArray"
    ];
    methods.forEach(function(methodName) {
        Cursor.prototype[methodName] = utils.getNativeMethod(methodName, NativeComponent);
    });

    module.exports = Cursor;

}).call(this);
