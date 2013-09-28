var GRClient = (function($, undefined) {

    var get = function(path, params, cb, auth) {
        var url = path + '?callback=?';
        if (params) {
            url += '&' + $.param(params);
        }

        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            success: cb,
            beforeSend : function(xhr) {
                if (auth) {
                    xhr.setRequestHeader("Authorization", auth);
                }
            }
        });
    };

    var post = function(path, data, cb, auth) {
        var url = path;
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: url,
            data: data,
            success: cb,
            beforeSend : function(xhr) {
                if (auth) {
                    xhr.setRequestHeader("Authorization", auth);
                }
            }
        });
    };


    var GameClient = function(host, gameid, username, authorization) {

        var game_id = gameid;
        var prefix = host + '/games/' + game_id;

        var user = username;
        var auth = authorization;

        this.get_game_id = function() {
            return game_id;        
        }

        this.add_player = function(player_id, callback) {
            var path = prefix + '/addplayer/:playerid';
            path = path.replace(':playerid', player_id);
            post(path, {}, callback, auth);
        }

        this.get_status = function(callback) {
            var path = prefix + '/status';
            post(path, {}, callback, auth);
        }

        this.start = function(callback) {
            var path = prefix + '/start';
            post(path, {}, callback, auth);
        }

        this.end = function(callback) {
            var path = prefix + '/end';
            post(path, {}, callback, auth);
        }

        this.send_command = function(command, callback) {
            var path = prefix + '/command';
            post(path, command, callback, auth);
        }
    }

    return function(host) {

        var user, auth;

        this.credentials = function(username, password) {
            user = username;
            auth = 'Basic ' + btoa(username + ':' + password);
        }

        this.list_engines = function(callback) {
            var path = host + '/engines';
            get(path, {}, callback);
        }

        this.register_player = function(player_id, player_data, callback) {
            var path = host + '/players/register';
            player_data.id = player_id;
            post(path, player_data, callback);
        }

        this.create_game = function(engine_name, callback) {
            var path = host + '/engines/:engine/create'.replace(':engine', engine_name);
            
            post(path, {}, function(game_instance) {
                var game_client = new GameClient(host, game_instance.id, user, auth);
                callback(game_client);
            }, auth);
        }

    }

})(jQuery);
