(function() {

    "use strict";

    var MongoClient = require('./client');
    var Mongo = require('mongodb');

    var ObjectID = Mongo.ObjectID;

    module.exports = {
        ObjectID: ObjectID,
        MongoClient: MongoClient
    };

}).call(this);
