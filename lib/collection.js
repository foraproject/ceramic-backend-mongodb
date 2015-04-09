(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');
    var Cursor = require("./cursor");

    var Collection = function(collection) {
        this.underlying = collection;
    };


    Collection.prototype.getMethod = function(methodName) {
        var self = this;
        var fn = generatorify(this.underlying[methodName]);
        return function*() {
            fn.apply(self.underlying, arguments);
        };
    };


    var methods = [
        "createIndex",
        "delete",
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
        Collection.prototype[method] = getMethod(methodName);
    });


    /*
        Override the find method so that we can return a custom cursor.
    */
    Collection.prototype.__native_find = getMethod("find");
    Collection.prototype.find = function*(query) {
        var cursor = yield* this.__native_find(query);
        return new Cursor(cursor);
    };


    module.exports = Collection;

}).call(this);
