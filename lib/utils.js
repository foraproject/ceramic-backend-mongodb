(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');

    var getNativeMethod = function(methodName, NativeComponent) {
        var fn = generatorify(NativeComponent.prototype[methodName]);
        return function*() {
            return yield* fn.apply(this.underlying, arguments);
        };
    };

    module.exports = {
        getNativeMethod: getNativeMethod
    };

}).call(this);
