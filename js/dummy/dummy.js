var colorsShapes = {
		
		path : "file:///c:/java/workspace/Pruebas/ColorsShapes_client/",
		
//    return {
        info : {             
        	name : 'colorsShapes Game Engine',
            allowed_players : {min:2, max:4}
        },
        redirect : function(action, data) { 
        	console.log("colorsShapes redirect");
    		if(action == "newGame")
    			colorsShapes.init(data);
			else if(action == "command")
				colorsShapes.command(data);
			else if(action == "status")
				colorsShapes.get_status(data);
        },
        init : function(data) { 
        	var data = colorsShapes.server.game.initGame();
        	
        	window.location = this.path + "game.html?dummy=true";
        },
        command : function(data) {
        	this.get_status(data);
        	return {is_valid: true, timestamp : 999, data : 'gamestatus' };
        },

        get_status : function(data) {
        	
        	var tokens = data.tokens;
        	var tokensArray  = new Array();
        	var boardTokens = new Array();

        	if(tokens !=null){
	        	for(var i=0;i<tokens.length;i++){
	        		if(tokens[i].onBoard || tokens[i].onBoard == "true"){
	        			boardTokens.push(tokens[i]);
	        		}else
	        			tokensArray.push(tokens[i]);
	        	}
        	}
        	
        	tokensArray = colorsShapes.server.token.getTokensFromArray(tokensArray);
        	boardTokens = colorsShapes.server.token.getTokensFromArray(boardTokens);
        	
        	//Add tokens if it is necessary
        	var numTokens = tokensArray.length;
        	for(numTokens;numTokens<6;numTokens++){
        		tokensArray.push("token"+(Math.floor(Math.random()*500)+1)+"_"+Math.floor((Math.random()*6)+1)+"_"+Math.floor((Math.random()*6)+1));
        	}

        	var statusData = {
        			dummy : true,
        			gameId : 1,
        			//players : [{id:1, name:"player1"},{id:2, name:"player2"}],
        			lastUpdate: "",
        			playerTurn: 1,
        			playerTokens: tokensArray.join(";;"),
        			boardTokens: boardTokens.join(";;")
        		};

        	var stringData = colorsShapes.server.util.serialize(statusData);
        	window.location = this.path + "/game.html?" + stringData;
        }

//    }
};

//module.exports = Dummy;
