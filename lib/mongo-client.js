(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');
    var NativeClient = require("mongodb").MongoClient;
    var Db = require("./db");

    var MongoClient = function() {};

    var _connect = generatorify(NativeClient.connect);
    MongoClient.connect = function*(url) {
        var db = yield* _connect.apply(NativeClient, [url]);
        return new Db(db);
    };

    module.exports = MongoClient;

}).call(this);
