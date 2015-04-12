(function() {

    "use strict";

    var mongodb = require("mongodb");
    var generatorify = require("nodefunc-generatorify");
    var Collection = require("./collection");

    var Db = function(db) {
        this.underlying = db;
    };

    var methods = [
        "dropDatabase",
        "close"
    ];
    methods.forEach(function(methodName) {
        Db.prototype[methodName] = function*() {
            var fn = generatorify(this.underlying[methodName]);
            return yield* fn.apply(this.underlying, arguments);
        };
    });


    Db.prototype.collection = function*() {
        var fn = generatorify(this.underlying.collection);
        var collection = yield* fn.apply(this.underlying, arguments);
        return new Collection(collection);
    };


    Db.prototype.ObjectID = mongodb.ObjectID;

    module.exports = Db;

}).call(this);
