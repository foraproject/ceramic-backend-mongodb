(function() {

    "use strict";

    var generatorify = require('nodefunc-generatorify');
    var NativeComponent = require("mongodb").MongoClient;
    var Db = require("./db");

    var Client = function() {};

    var _connect = generatorify(NativeComponent.connect);
    Client.connect = function*(conf) {
        var connString;

        if (typeof conf === "string") {
            connString = conf;
        } else {
            conf.host = conf.host || "localhost";
            conf.port = conf.port || 27017;
            connString = "mongodb://" + conf.host + ":" + conf.port + "/" + conf.database;
        }

        var db = yield* _connect.apply(NativeComponent, [connString]);
        return new Db(db);
    };

    module.exports = Client;

}).call(this);
