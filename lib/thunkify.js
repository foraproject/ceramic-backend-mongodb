(function() {

    "use strict";

    module.exports = function thunkify(fn){
        var thunkFn = function(){
            var args = Array.prototype.slice.call(arguments);
            var ctx = this;

            return function(done){
                var called;

                args.push(function(){
                    if (called) return;
                    called = true;
                    done.apply(null, arguments);
                });

                try {
                    fn.apply(ctx, args);
                } catch (err) {
                    done(err);
                }
            };
        };

        return function*() {
            try {
                var args = Array.prototype.slice.call(arguments);
                return yield thunkFn.apply(this, args);
            } catch(e) {
                e._inner = new Error();
                throw e;
            }
        };
    };

})();
