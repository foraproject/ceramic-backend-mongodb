(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');
    var NativeClient = require("mongodb").MongoClient;
    var Db = require("./db");

    var MongoClient = function() {};

    var _connect = generatorify(NativeClient.connect);
    MongoClient.connect = function*(conf) {
        var connString;

        if (typeof conf === "string") {
            connString = conf;
        } else {
            conf.host = conf.host || "localhost";
            conf.port = conf.port || 27017;
            connString = "mongodb://" + conf.host + ":" + conf.port + "/" + conf.database;
        }

        var db = yield* _connect.apply(NativeClient, [connString]);
        return new Db(db);
    };

    module.exports = MongoClient;

}).call(this);
