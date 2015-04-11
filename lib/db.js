(function() {

    "use strict";

    var mongodb = require("mongodb");
    var NativeComponent = mongodb.Db;
    var Collection = require("./collection");
    var utils = require("./utils");

    var Db = function(db) {
        this.underlying = db;
    };

    var methods = [
        "dropDatabase",
        "close"
    ];
    methods.forEach(function(methodName) {
        Db.prototype[methodName] = utils.getNativeMethod(methodName, NativeComponent);
    });

    /*
        Override the collection method so that we can return a custom collection
    */
    Db.prototype.__native_collection = utils.getNativeMethod("collection", NativeComponent);
    Db.prototype.collection = function*() {
        var collection = yield* this.__native_collection.apply(this, arguments);
        return new Collection(collection);
    };


    Db.prototype.ObjectID = mongodb.ObjectID;

    module.exports = Db;

}).call(this);
