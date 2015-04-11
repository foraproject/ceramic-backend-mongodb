(function() {

    "use strict";

    var NativeComponent = require("mongodb").Collection;
    var Cursor = require("./cursor");
    var utils = require("./utils");

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
        Collection.prototype[methodName] = utils.getNativeMethod(methodName, NativeComponent);
    });


    /*
        Override the find method so that we can return a custom cursor.
    */
    Collection.prototype.__native_find = utils.getNativeMethod("find", NativeComponent);
    Collection.prototype.find = function*() {
        var cursor = yield* this.__native_find.apply(this, arguments);
        return new Cursor(cursor);
    };


    module.exports = Collection;

}).call(this);
