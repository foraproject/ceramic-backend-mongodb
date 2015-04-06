(function() {

    var Mongo = require('mongodb');

    var generatorify = require('nodefunc-generatorify');

    var MongoDb = function(conf) {
        conf.host = conf.host || "127.0.0.1";
        conf.port = conf.port || 27017;
        this.conf = conf;
    };

    MongoDb.prototype.getDb = function*() {
        var client;
        if (!this.db) {
            client = new Mongo.Db(this.conf.name, new Mongo.Server(this.conf.host, this.conf.port, {}), {
                safe: true
            });
            this.db = yield* generatorify(client.open).call(client);
        }
        return this.db;
    };



    MongoDb.prototype.insert = function*(collectionName, document) {
        var collection, db;
        db = yield* this.getDb();
        collection = yield* generatorify(db.collection).call(db, collectionName);
        return yield* generatorify(collection.insertOne).call(collection, document, {
            safe: true
        });
    };


    MongoDb.prototype.update = function*(collectionName, query, document) {
        var collection, db;
        db = yield* this.getDb();
        collection = yield* generatorify(db.collection).call(db, collectionName);
        yield* generatorify(collection.updateOne).call(collection, query, document, {
            safe: true,
            multi: false
        });
    };


    MongoDb.prototype.count = function*(collectionName, query) {
        var cursor;
        cursor = yield* this.getCursor(collectionName, query);
        return yield* generatorify(cursor.count).call(cursor);
    };


    MongoDb.prototype.find = function*(collectionName, query, options) {
        var cursor;
        if (!options) {
            options = {};
        }
        cursor = yield* this.getCursor(collectionName, query, options);
        return yield* generatorify(cursor.toArray).call(cursor);
    };


    MongoDb.prototype.findOne = function*(collectionName, query, options) {
        var cursor;
        if (!options) {
            options = {};
        }
        cursor = yield* this.getCursor(collectionName, query, options);
        return yield* generatorify(cursor.nextObject).call(cursor);
    };


    MongoDb.prototype.remove = function*(collectionName, query, options) {
        var collection, db;
        if (!options) {
            options = {};
        }
        db = yield* this.getDb();
        collection = yield* generatorify(db.collection).call(db, collectionName);
        return yield* generatorify(collection.remove).call(collection, query, {
            safe: true
        });
    };


    MongoDb.prototype.deleteDatabase = function*() {
        var db;
        db = yield* this.getDb();
        return yield* (generatorify(db.dropDatabase)).call(db);
    };


    MongoDb.prototype.setupIndexes = function*(entitySchemas) {
        var db = yield* this.getDb();
        for (var name in entitySchemas) {
            var entitySchema = entitySchemas[name];
            if (entitySchema.indexes) {
                var collection = yield* generatorify(db.collection).call(db, entitySchema.collection);
                for (var i = 0; i < entitySchema.indexes.length; i++) {
                    var index = entitySchema.indexes[i];
                    yield* generatorify(collection.ensureIndex).call(collection, index);
                }
            }
        }
    };


    MongoDb.prototype.ObjectId = function(id) {
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


    MongoDb.prototype.getCursor = function*(collectionName, query, options) {
        var collection, cursor, db;
        if (!options) {
            options = {};
        }
        db = yield* this.getDb();
        collection = yield* generatorify(db.collection).call(db, collectionName);
        cursor = collection.find(query);
        if (options.sort) {
            cursor = cursor.sort(options.sort);
        }
        if (options.limit) {
            cursor = cursor.limit(options.limit);
        }
        return cursor;
    };

    module.exports = MongoDb;

}).call(this);
