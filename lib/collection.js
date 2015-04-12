(function() {

    "use strict";

    var generatorify = require("nodefunc-generatorify");
    var Cursor = require("./cursor");

    var Collection = function(collection) {
        this.underlying = collection;
    };


    var methods = [
        "count",
        "createIndex",
        "deleteOne",
        "deleteMany",
        "drop",
        "dropIndex",
        "findOne",
        "insertOne",
        "insertMany",
        "updateOne",
        "updateMany"
    ];
    methods.forEach(function(methodName) {
        Collection.prototype[methodName] = function*() {
            var fn = generatorify(this.underlying[methodName]);
            return yield* fn.apply(this.underlying, arguments);
        };
    });


    Collection.prototype.find = function*() {
        var fn = generatorify(this.underlying.find);
        var cursor = yield* fn.apply(this.underlying, arguments);
        return new Cursor(cursor);
    };

    module.exports = Collection;

}).call(this);
