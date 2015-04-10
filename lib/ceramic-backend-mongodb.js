(function() {

    "use strict";

    var MongoClient = require('./client');
    var Mongo = require('mongodb');


    var ObjectID = function(id) {
        if (id) {
            if (typeof id === "string") {
                return new Mongo.ObjectID(id);
            } else {
                return id;
            }
        } else {
            return new Mongo.ObjectID();
        }
    };


    module.exports = {
        ObjectID: ObjectID,
        MongoClient: MongoClient
    };
    

}).call(this);
