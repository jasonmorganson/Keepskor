exports.attach = function() {

    var app = this;

    app.use(app.flatiron.plugins.http, {

        onError: function(error) {
            this.res.writeHead(404);
            this.res.end();
        }
    });

};
