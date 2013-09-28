App.events = (function(app, $, undefined) {
    
    $(document).ready(function() {

        $.ajaxSetup({ cache: false });
     
        // listen action events
        $('.action-login').click(function() {

            console.log("Login");

            var gr = new GRClient('http://localhost:8000');

            var userId = parseInt(Math.random()*100);
            var user = document.getElementById("user").value;
            var password = document.getElementById("password").value;

            playerSession = {   name: user,
                                password: password                
                    }

            // register players in the system
            gr.register_player(userId, playerSession, function(result){
                console.log('register player a', result);
            
                playerSession.userId = result.id;

                sessionStorage.setItem("playerSession", JSON.stringify(playerSession));

                window.location.replace("\game.html");
            });
                        
            return false;
        });
    });
    
})(App || {}, jQuery);