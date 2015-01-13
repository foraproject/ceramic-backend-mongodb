(function() {

    var Mongo = require('mongodb');

    var thunkify = require('./thunkify');
    var Parser = require('./queryparser');

    var MongoDb = function(conf) {
        this.conf = conf;
        this.rowId = this.conf.rowId || "_id";
    };


    MongoDb.prototype.getDb = function*() {
        var client;
        if (!this.db) {
            client = new Mongo.Db(this.conf.name, new Mongo.Server(this.conf.host, this.conf.port, {}), {
                safe: true
            });
            this.db = yield thunkify(client.open).call(client);
            this.parser = new Parser(this.conf);
        }
        return this.db;
    };



    MongoDb.prototype.insert = function*(collectionName, document) {
        var collection, db;
        db = yield this.getDb();
        collection = yield thunkify(db.collection).call(db, collectionName);
        return yield thunkify(collection.insertOne).call(collection, document, {
            safe: true
        });
    };


    MongoDb.prototype.update = function*(collectionName, query, document) {
        var collection, db;
        db = yield this.getDb();
        query = this.parser.parse(query);
        collection = yield thunkify(db.collection).call(db, collectionName);
        yield thunkify(collection.updateOne).call(collection, query, document, {
            safe: true,
            multi: false
        });
    };


    MongoDb.prototype.count = function*(collectionName, query) {
        var cursor;
        cursor = yield this.getCursor(collectionName, query);
        return yield thunkify(cursor.count).call(cursor);
    };


    MongoDb.prototype.find = function*(collectionName, query, options) {
        var cursor;
        if (!options) {
            options = {};
        }
        cursor = yield this.getCursor(collectionName, query, options);
        return yield thunkify(cursor.toArray).call(cursor);
    };


    MongoDb.prototype.findOne = function*(collectionName, query, options) {
        var cursor;
        if (!options) {
            options = {};
        }
        cursor = yield this.getCursor(collectionName, query, options);
        return yield thunkify(cursor.nextObject).call(cursor);
    };


    MongoDb.prototype.remove = function*(collectionName, query, options) {
        var collection, db;
        if (!options) {
            options = {};
        }
        db = yield this.getDb();
        query = this.parser.parse(query, collectionName);
        collection = yield thunkify(db.collection).call(db, collectionName);
        yield thunkify(collection.removeOne).call(collection, query, {
            safe: true
        });
    };


    MongoDb.prototype.deleteDatabase = function*() {
        var db;
        db = yield this.getDb();
        return yield (thunkify(db.dropDatabase)).call(db);
    };


    MongoDb.prototype.setupIndexes = function*(entitySchemas) {
        var db = yield this.getDb();
        for (var name in entitySchemas) {
            var entitySchema = entitySchemas[name];
            if (entitySchema.indexes) {
                var collection = yield thunkify(db.collection).call(db, entitySchema.collection);
                for (var i = 0; i < entitySchema.indexes.length; i++) {
                    var index = entitySchema.indexes[i];
                    yield thunkify(collection.ensureIndex).call(collection, index);
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
        db = yield this.getDb();
        query = this.parser.parse(query);
        collection = yield thunkify(db.collection).call(db, collectionName);
        cursor = collection.find(query);
        if (options.sort) {
            cursor = cursor.sort(options.sort);
        }
        if (options.limit) {
            cursor = cursor.limit(options.limit);
        }
        return cursor;
    };


    MongoDb.prototype.getRowId = function(obj) {
        return obj[this.rowId] ? obj[this.rowId].toString() : null;
    };


    MongoDb.prototype.setRowId = function(obj, val) {
        if (val) {
            if (typeof val === 'string') {
                val = this.ObjectId(val);
            }
            obj[this.rowId] = val;
        }
        return obj;
    };

    module.exports = MongoDb;

}).call(this);
