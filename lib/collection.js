(function() {

    "use strict";

    var generatorify = require("nodefunc-generatorify");
    var Cursor = require("./cursor");

    var Collection = function(collection) {
        this.underlying = collection;
    };


    var methods = [
        "createIndex",
        "deleteOne",
        "deleteMany",
        "drop",
        "dropIndex",
        "findOne",
        "findOneAndDelete",
        "findOneAndReplace",
        "insertOne",
        "insertMany",
        "updateOne",
        "updateMany",
        "count"
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
