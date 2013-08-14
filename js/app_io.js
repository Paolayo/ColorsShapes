App.io = (function(app, $, undefined) {

    var server = 'http://localhost:8000';

    var get = function(path, params, cb) {
        var url = server + path + '?callback=?';
        if (params) {
            url += '&' + $.param(params);
        }

        $.getJSON(url, cb);
    };

    var post = function(path, data, cb) {
        var url = server + path;
        $.post(url, data, cb);
    };

    return {
        get : get,
        post : post
    };
    
})(App || {}, jQuery);
