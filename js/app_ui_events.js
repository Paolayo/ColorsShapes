App.events = (function(app, $, undefined) {

    var gameClient;
    
    $(document).ready(function() {

        $.ajaxSetup({ cache: false });

        var gr = new GRClient('http://localhost:8000');

        var player = JSON.parse(sessionStorage.getItem("playerSession"));

        console.log(player);

        // set user auth
        // this should invoked if the player changes (every turn)
        gr.credentials(player.id, player.password);

        // create new game instance
        gr.create_game(config.engine, function(client){
                  
                  // save somewhere the game-client
                  gameClient = client;

                  config.gameid = client.get_game_id();

                  console.log('created game ', config.gameid);

                  // add registered players to game
                  client.add_player(player.id, function(result){
                    console.log('add player a', result)
                  });

                  client.add_player('b', function(result){
                    console.log('add player b', result)
                  });


                  }, 500);

            $('.action-start').click(function() {

                console.log('game started!! id=%s', config.gameid);
                
                gameClient.start(function(result){
                        console.log('start game', result)

                        // after start game, send player command
                        gameClient.send_command({foo:'bar'}, function(result){
                          console.log('command', result);
                        });

                        // retrieve game status
                        gameClient.get_status(function(result){
                          console.log('get game status', result)

                              console.log('Getting player tokens ');

                              $('.action-create').hide();
                              $('.action-start').hide();
                              $('.action-next').show().attr('gameid', config.gameid);

                              sessionStorage.setItem("playerTokens", JSON.stringify(result.playerData.playerTokens));
                              sessionStorage.setItem("boardTokens", JSON.stringify(result.playerData.boardTokens));

                              colorsShapes.game.loadGame();

                        });
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
      
      return {
          raise_global : function(event_name, params) {
              $(document).trigger(event_name, Array.prototype.slice.call(arguments, 1))
          }
      };
    });
    
})(App || {}, jQuery);
