(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');
    var Collection = require("./collection");

    var Db = function(db) {
        this.underlying = db;
    };


    Db.prototype.getMethod = function(methodName) {
        var self = this;
        var fn = generatorify(this.underlying[methodName]);
        return function*() {
            fn.apply(self.underlying, arguments);
        };
    };


    var methods = [
        "dropDatabase",
        "close"
    ];
    methods.forEach(function(methodName) {
        Db.prototype[method] = getMethod(methodName);
    });


    /*
        Override the collection method so that we can return a custom collection
    */
    Db.prototype.__native_collection = getMethod("collection");
    Db.prototype.find = function*(collectionName) {
        var collection = yield* this.__native_collection(collectionName);
        return new Collection(collection);
    };

    module.exports = Db;

}).call(this);
