App.events = (function(app, $, undefined) {
    
    $(document).ready(function() {

        $.ajaxSetup({ cache: false });

        var gameid = document.getElementById('gameid').value;
        var playerTokens = null;

        if(gameid==null || gameid=='')
            $('.action-create').show();
        else
            $('.action-start').show().attr('gameid', gameid);

        $('input').focus();

        app.io.get('/engines', null, function(games) {
            //$("#gameListTemplate").tmpl({games:games}).appendTo($("#gamelist"));

            $.each(games, function(idx, game) {
                $('#engine').append($('<option />').attr('value', game).text(game));
            });
        });

        

      
        // listen action events
        $('.action-create').click(function() {

            console.log("Creating new game");

            var engine = document.getElementById('engine').value;     
            var path = '/engines/:engine/create'.replace(':engine', engine);
            console.log("Engine "+engine);

            var selected_checks = $('#playerchecks').find(':checkbox:checked');

            //var data = {random:Math.random()};

            app.io.post(path, null, function(game) {

                    var add_player_path = '/games/:gameid/addplayer/:playerid'
                        .replace(':gameid', game.id)
                        .replace(':playerid', document.getElementById('playerid').value);
                    
                    app.io.post(add_player_path, null, function(player) {
                        //console.log('added player %s to game %s', player.id, game.id);

                        $('.action-create').hide();
                        $('.action-start').show().attr('gameid', game.id);
                    });
            });

            return false;
        });

        $('.action-start').click(function() {
            var gameid = $(this).attr('gameid');
            //var engine = document.getElementById('engine').value;    
            var path = '/games/:gameid/start'.replace(':gameid', gameid);

            app.io.post(path, null, function(success) {

                    console.log('game started!! id=%s', gameid);
                    var status_path = '/games/:gameid/status'.replace(':gameid', gameid);

                    var data = {
                            gameid: gameid,
                            playerid: document.getElementById('playerid').value
                        }

                    app.io.post(status_path, data, function(res) {
                        console.log('Getting player tokens ');

                        $('.action-create').hide();
                        $('.action-start').hide();
                        $('.action-next').show().attr('gameid', gameid);

                        sessionStorage.setItem("playerTokens", JSON.stringify(res.playerData.playerTokens));
                        sessionStorage.setItem("boardTokens", JSON.stringify(res.playerData.boardTokens));

                        colorsShapes.game.loadGame();
                        //colorsShapes.board.drawCanvasBoard(document.getElementById("canvasBoard"));
                        
                        //colorsShapes.board.drawCanvasBoard(document.getElementById("canvasBoard"));
                        //colorsShapes.board.drawCanvasPlayerTokens(document.getElementById("canvasPlayerTokens"), data.playerTokens);*/
                    });


                //}
                
            });

            



            return false;
        });

        $('.action-next').click(function() {

            var correctMove = colorsShapes.game.endMove(playerTokens);

            if(correctMove){

                var gameid = $(this).attr('gameid');
                var path = '/games/:gameid/command'.replace(':gameid', gameid);

                var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));

                var data = {
                            gameid: gameid,
                            playerid: document.getElementById('playerid').value,
                            playerTokens: playerTokens
                        }

                app.io.post(path, data, function(res) {

                    if(!res.is_valid)
                        alert("Ha ocurrido un error en la validación del movimiento en el servidor.");
                    else{
                        sessionStorage.setItem("playerTokens", JSON.stringify(res.playerData.playerTokens));
                        sessionStorage.setItem("boardTokens", JSON.stringify(res.playerData.boardTokens));
                        colorsShapes.game.loadGame();
                    }
                 
                });
            }
            
            return false;
        });


        // listen global events
        
    });

   
    
    return {
        raise_global : function(event_name, params) {
            $(document).trigger(event_name, Array.prototype.slice.call(arguments, 1))
        }
    };
    
})(App || {}, jQuery);
