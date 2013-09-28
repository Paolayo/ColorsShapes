colorsShapes.game = (function() {
			
			var numPlayers = 4;
			var players = new Array();
			var board;

		    return {

		        loadGame : function (){
                    
                    var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));

                    var images = new Array();
                    var loadedImages = 0;

                    var stage = new Kinetic.Stage({
                                                  container: "container",
                                                  width: config.tile.size*config.board.cols,
                                                  height: config.tile.size*(config.board.rows+2)
                                                });

                    var layer = new Kinetic.Layer();

                    //Board
                    drawCanvasBoard(layer, config.board.rows, config.board.cols, config.board.x_begin, config.board.y_begin, config.tile.size);
                     //Board tokens
                    drawBoardTokens(layer, config.tile.size);
                    //Player Board
                    drawCanvasBoard(layer, 1, playerTokens.length, config.playerBoard.x_begin, config.playerBoard.y_begin, config.tile.size);
                    //Player tokens
                    drawPlayerTokens(layer, config.tile.size);

                    stage.add(layer);

		        },
		        
		        endMove: function(){

			        var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

			        //Check if the tokens are in correct position
			        var correctPosition;
			        if(boardTokens.length>0)
			       		correctPosition = isJoinedToken(null, 0);
					else
			       		correctPosition = isJoinedTokenFirstMove();

			       	if(!correctPosition){
			       		alert("Hay fichas en el tablero que se encuentran mal posicionadas.");
			       		return false;
			       	}else
			       		countPoints();
			       	return true;

		        }
		    };

	/*DrawBoard functions*/
	function drawCanvasBoard(layer, rows, cols, x_position, y_position, size) {
					//Player board
                    //Vertical
                    for(var i=0; i<=cols;i++){
                    	var line = new Kinetic.Line({
					        points: [i*size+x_position, 0+y_position, i*size+x_position, rows*size+y_position],
					        stroke: 'black',
					        lineCap: 'round',
					        lineJoin: 'round'
					      });
                        layer.add(line);
                    }

                    for(var i=0; i<=rows;i++){
                    	var line = new Kinetic.Line({
					        points: [0+x_position, i*size+y_position, cols*size+x_position, i*size+y_position],
					        stroke: 'black',
					        lineCap: 'round',
					        lineJoin: 'round'
					      });
                        layer.add(line);
                    }
		        }
	
	function drawPlayerTokens(layer, size){

					var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));

					for(var i=0; i<playerTokens.length;i++){

						var token = drawToken(playerTokens[i], layer, size, size*(i+0.5), size/2, true, "black");
						token.init = i;
                        	
						layer.add(token);

						sessionStorage.setItem("playerTokens", JSON.stringify(playerTokens));
					}
				}

	function drawBoardTokens(layer, size){

			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

			        /*var group = new Kinetic.Group({
	       							draggable: true
	      				});

					group.on('mouseover', function() {
						document.body.style.cursor = 'pointer';
					});
					group.on('mouseout', function() {
						document.body.style.cursor = 'default';
					});

					group.on('dragend', function(obj) {
						//alert(group.attrs.x+","+group.attrs.y);
						dragEndGroup(this);
					});*/

		        	for(var i=0; i<boardTokens.length;i++){

                    	var token = drawToken(boardTokens[i], null, size, size*(boardTokens[i].x_position+0.5), (size*(boardTokens[i].y_position+0.5))+2*size, false, "grey");
						token.init = i;

						layer.add(token);                        	
                        //group.add(token);

                        sessionStorage.setItem("boardTokensTokens", JSON.stringify(boardTokens));
                    }

                    //layer.add(group);
		        }

		function drawToken(token, layer, size, x_position, y_position, draggable, strokeColor){

		var boardToken;

        var color = colorsShapes.util.getColor(token.color);

		if(token.shape==1){
			token.y_margin = 0;
			token.x_init = x_position;
			token.y_init = y_position+token.y_margin;
			boardToken = new Kinetic.Circle({
					id:token.id,
					x: token.x_init,
					y: token.y_init,
					radius: (size-5)/2,
					fill: color,
					stroke: strokeColor,
					draggable: draggable
				});

		}else if(token.shape==2){
			token.y_margin = 0;
			token.x_init = x_position;
			token.y_init = y_position+token.y_margin;
			boardToken = new Kinetic.RegularPolygon({
					id:token.id,
					x: token.x_init,
					y: token.y_init,
					sides: 4,
					radius: (size+3)/2,
					//fillPatternOffset: [32, 32],
					stroke: strokeColor,
					fill: color,
					//strokeWidth: 4,
					draggable: draggable
				});
			boardToken.rotate(45 * Math.PI / 180);

		}else if(token.shape==3){
			token.y_margin = 5;
			token.x_init = x_position;
			token.y_init = y_position+token.y_margin;
			boardToken = new Kinetic.RegularPolygon({
					id:token.id,
					x: token.x_init,
					y: token.y_init,
					sides: 3,
					radius: (size)/2,
					//fillPatternOffset: [32, 32],
					stroke: strokeColor,
					fill: color,
					//strokeWidth: 4,
					draggable: draggable
				});
						
		}else if(token.shape==4){
			token.y_margin = 0;
			token.x_init = x_position;
			token.y_init = y_position+token.y_margin;
			boardToken = new Kinetic.RegularPolygon({
					id:token.id,
					x: token.x_init,
					y: token.y_init,
					sides: 4,
					radius: (size-5)/2,
					//fillPatternOffset: [32, 32],
					stroke: strokeColor,
					fill: color,
					//strokeWidth: 4,
					draggable: draggable
				});

		}else if(token.shape==5){
			token.y_margin = 1.5;
			token.x_init = x_position;
			token.y_init = y_position+token.y_margin;
			boardToken = new Kinetic.RegularPolygon({
					id:token.id,
					x: token.x_init,
					y: token.y_init,
					sides: 5,
					radius: (size-5)/2,
					//fillPatternOffset: [32, 32],
					stroke: strokeColor,
					fill: color,
					//strokeWidth: 4,
					draggable: draggable
				});

		}else{
			token.y_margin = 0;
			token.x_init = x_position;
			token.y_init = y_position+token.y_margin;
	        boardToken = new Kinetic.RegularPolygon({
					id:token.id,
					x: token.x_init,
					y: token.y_init,
					sides: 6,
					radius: (size-5)/2,
					//fillPatternOffset: [32, 32],
					stroke: strokeColor,
					fill: color,
					//strokeWidth: 4,
					draggable: draggable
				});
		}

		if(draggable){
				// add cursor styling
				boardToken.on('mouseover', function() {
					document.body.style.cursor = 'pointer';
				});
								
				boardToken.on('mouseout', function() {
					document.body.style.cursor = 'default';
				});
				//Move to init position
				boardToken.on('dblclick', function(obj) {
					doubleClick(this, layer);
				});

				boardToken.on('dragend', function(obj) {
					dragEnd(this, layer);
				});
			}
			return boardToken;
	}

	/*Move token functions*/
	function moveToken(tokenBoard, token, onBoard, x_coordenates, y_coordenates, x_position, y_position){
		        	var tween = new Kinetic.Tween({
										    node: tokenBoard, 
										    duration: 0.1,
										    x: x_coordenates,
										    y: y_coordenates,
										  });
					tween.play();
					token.x_position = x_position;
					token.y_position = y_position;
					if((token.x_position_init==null && token.y_position_init==null)||(token.x_position==null && token.y_position==null)){
                    	token.x_position_init = x_position;
						token.y_position_init = y_position;
					}
					token.onBoard = onBoard;
	}

	function doubleClick(token, layer){

		var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
		for (var i = playerTokens.length - 1; i >= 0; i--) {
			if(token.attrs.id == playerTokens[i].id){
				//romeveTokenGroup(token);
				layer.add(token);

				moveToken(token, playerTokens[i], false, playerTokens[i].x_init, playerTokens[i].y_init, null, null);
				sessionStorage.setItem("playerTokens", JSON.stringify(playerTokens));
			}
		}
	}

	function dragEnd(token, layer){
		
		token.attrs.id;
		var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
		for (var i = playerTokens.length - 1; i >= 0; i--) {
			if(token.attrs.id == playerTokens[i].id){
				//Move to board
				if(token.attrs.y>=config.board.y_begin){

					//new coordenates
					var x_coordenates = parseInt(token.attrs.x/config.tile.size)*config.tile.size+config.tile.size/2;
					var y_coordenates = parseInt(token.attrs.y/config.tile.size)*config.tile.size+config.tile.size/2+playerTokens[i].y_margin;
					//New position
					var x_position = parseInt(x_coordenates/config.tile.size);
					var y_position = parseInt(y_coordenates/config.tile.size)-2;

					if(checkMove(playerTokens[i], x_position, y_position)){
						moveToken(token, playerTokens[i], true, x_coordenates, y_coordenates, x_position, y_position);
						romeveTokenGroup(token);
						for (var e = 0; e<layer.children.length; e++) {
							if(layer.children[e].nodeType  == "Group"){
								layer.children[e].add(token);
								break;
							}
						}
					}else{
						romeveTokenGroup(token);
						layer.add(token);
						moveToken(token, playerTokens[i], false, playerTokens[i].x_init, playerTokens[i].y_init, null, null);
					}
				}else{
					romeveTokenGroup(token);
					layer.add(token);
					moveToken(token, playerTokens[i], false, playerTokens[i].x_init, playerTokens[i].y_init, null, null);
				}
			}
		}
		sessionStorage.setItem("playerTokens", JSON.stringify(playerTokens));
	}

	function romeveTokenGroup(token){
		var parent = token.parent;
		if(parent.nodeType == "Group"){
			for (var e = 0; e<parent.children.length; e++) {
				if(parent.children[e].attrs.id  == token.attrs.id){
					parent.children[e].remove();
					break;
				}
			};
		}
	}

	function dragEndGroup(group){

		var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));
		var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));

		//New coordenates
		var x_coordenates = parseInt(group.attrs.x/config.tile.size)*config.tile.size;
		var y_coordenates = parseInt(group.attrs.y/config.tile.size)*config.tile.size;
		//New position
		var x_position = parseInt(x_coordenates/config.tile.size);
		var y_position = parseInt(y_coordenates/config.tile.size);

		var tween = new Kinetic.Tween({
										    node: group, 
										    duration: 0.1,
										    x: x_coordenates,
										    y: y_coordenates,
										  });
		tween.play();


		for (var i = group.children.length - 1; i >= 0; i--) {
			var token = group.children[i];
			//var x_position = parseInt(token.attrs.x/config.tile.size);
			//var y_position = parseInt(token.attrs.y/config.tile.size)-2;

			for (var e = playerTokens.length - 1; e >= 0; e--) {
				if(token.id == playerTokens[e].id){
					playerTokens[e].x_position = playerTokens[e].x_position_init+x_position;
					playerTokens[e].y_position = playerTokens[e].y_position_init+y_position;
					break;				
				}
			}

			for (var e = boardTokens.length - 1; e >= 0; e--) {
				if(token.attrs.id == boardTokens[e].id){
					boardTokens[e].x_position = boardTokens[e].x_position_init+x_position;
					boardTokens[e].y_position = boardTokens[e].y_position_init+y_position;
					break;
				}
			}
		}

		sessionStorage.setItem("boardTokens", JSON.stringify(boardTokens));
		sessionStorage.setItem("playerTokens", JSON.stringify(playerTokens));
	}

	function checkMove(token, x_position, y_position){

			        var emptyBox = true;
			        var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

			        //Checking if there are token on the board
			        if(boardTokens.length == 0){
			        	for (var i = playerTokens.length - 1; i >= 0; i--) {
			        		if(playerTokens[i].id !=token.id && playerTokens[i].onBoard)
			        			break;
			        	}
			        	if(i<0)
			        		return true;
					}

					//Only one token in the same position
					for (var i = boardTokens.length - 1; i >= 0; i--) {
						if(boardTokens[i].x_position == x_position && boardTokens[i].y_position == y_position)
							return false;
					}
					for (var i = playerTokens.length - 1; i >= 0; i--) {
						if(playerTokens[i].onBoard && playerTokens[i].x_position == x_position && playerTokens[i].y_position == y_position)
							return false;
					}

			        /*******Horizontal check*******/
			        var horizontalTokens = getHorizontalTokens(token, x_position, y_position);
					for(var i=0; i<horizontalTokens.length; i++){
			        	for(var e=i+1; e<horizontalTokens.length; e++){
			       			if((horizontalTokens[i].id!=horizontalTokens[e].id) &&
			       			   ((horizontalTokens[i].color != horizontalTokens[e].color && horizontalTokens[i].shape != horizontalTokens[e].shape) ||
			       			    (horizontalTokens[i].color == horizontalTokens[e].color && horizontalTokens[i].shape == horizontalTokens[e].shape)))
			       				return false;
			       		}
					}

			        /*******Vertical check*******/
			        var verticalTokens = getVerticalTokens(token, x_position, y_position);
					for(var i=0; i<verticalTokens.length; i++){
			        	for(var e=i+1; e<verticalTokens.length; e++){
			       			if((verticalTokens[i].id != verticalTokens[e].id) &&
			       			   ((verticalTokens[i].color != verticalTokens[e].color && verticalTokens[i].shape != verticalTokens[e].shape) ||
			       			    (verticalTokens[i].color == verticalTokens[e].color && verticalTokens[i].shape == verticalTokens[e].shape)))
			       				return false;
			       		}
					}

			        //Always near other tokens
			        if(verticalTokens.length>1 || horizontalTokens.length>1)
			        	return true;
			        return false;

				}




	function isJoinedTokenFirstMove(){

		        	var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));

					var tokensOnBoard = joinedTokenFirstMove(null, null);

		        	var countTokensOnBoard = 0;
			       	for (var i = playerTokens.length - 1; i >= 0; i--) {
			       		if(playerTokens[i].onBoard)
			       			countTokensOnBoard++;
			       	}

			       	return tokensOnBoard.length==countTokensOnBoard;
		        }
	
	function joinedTokenFirstMove(previous, tokensOnBoard){

		        	var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

			        if(tokensOnBoard ==null)
			        	tokensOnBoard = new Array();

		        	//Board tokens check
		        	for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
		        		if(playerTokens[numBoardToken].onBoard){
		        			if( (tokensOnBoard.length==0 && previous == null) ||
		        				(previous!=null && playerTokens[numBoardToken].id!=previous.id &&
			        				((playerTokens[numBoardToken].x_position==previous.x_position && (playerTokens[numBoardToken].y_position==previous.y_position+1 || playerTokens[numBoardToken].y_position==previous.y_position-1)) || 
			        			 	(playerTokens[numBoardToken].y_position==previous.y_position && (playerTokens[numBoardToken].x_position==previous.x_position+1 || playerTokens[numBoardToken].x_position==previous.x_position-1))))){
			        			
				        			//before checked?
				        			var checked = false;
				        			for (var i = tokensOnBoard.length - 1; i >= 0; i--) {
				        				if(tokensOnBoard[i].id==playerTokens[numBoardToken].id)
				        					checked = true;
				        			}

				        			if(!checked){
					        			tokensOnBoard.push(playerTokens[numBoardToken]);
					        			joinedTokenFirstMove(playerTokens[numBoardToken], tokensOnBoard);
					        		}
			        		}
			        	}
					}
					return tokensOnBoard;

	}

	/*Turn ends*/
	function countPoints(){
		    	
		        	var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

			    	var points = 0;
			    				    	
			    	for(var i=0;i<playerTokens.length; i++){
			    		var token = playerTokens[i];
			    		var tokenId = parseInt(token.id);

			    		

			    		//Only count the row if the token has the lowest id
			    		var horizontalTokens = getHorizontalTokens(playerTokens[i], playerTokens[i].x_position, playerTokens[i].y_position);
			    		var firstToken = true;
			    		for (var htoken = horizontalTokens.length - 1; htoken >= 0; htoken--) {
			    			if(parseInt(horizontalTokens[htoken].id) < tokenId && horizontalTokens[htoken].playerToken){
			    				firstToken = false;
			    			}
			    		};
			    		
		        		//Check if there are other player tokens in the same row
					    if(firstToken){
					      	//If there is 6 tokens, you will sum config.tile.size/2 points
					      	if(horizontalTokens.length==6)
					       		points = points+config.tile.size/2;
					       	else if(horizontalTokens.length>1)
					       		points = points+horizontalTokens.length;
					    }



					    //Only count the col if the token has the lowest id
					    var verticalTokens = getVerticalTokens(playerTokens[i], playerTokens[i].x_position, playerTokens[i].y_position);
			    		var firstToken = true;
			    		for (var vtoken = verticalTokens.length - 1; vtoken >= 0; vtoken--) {
			    			if(parseInt(verticalTokens[vtoken].id) < tokenId && verticalTokens[vtoken].playerToken){
			    				firstToken = false;
			    			}
			    		};
			    		
		        		//Check if there are other player tokens in the same row
					    if(firstToken){
					      	//If there is 6 tokens, you will sum config.tile.size/2 points
					      	if(verticalTokens.length==6)
					       		points = points+config.tile.size/2;
					       	else if(verticalTokens.length>1)
					       		points = points+verticalTokens.length;
					    }
			    	}

			    	alert(points);

			    	return points;
		        }


	function isJoinedToken(token){

		var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
		var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

		for (var i = playerTokens.length - 1; i >= 0; i--) {
			if(playerTokens[i].onBoard)
				if(!isJoinedTokenCheck(boardTokens, playerTokens, playerTokens[i], null)){
					alert("Token: "+playerTokens[i].x_position+","+playerTokens[i].y_position);
					return false;
				}
		};
		return true;
	}

	function isJoinedTokenCheck(boardTokens, playerTokens, token, previoustoken){
		//Board tokens check
		if(boardTokens!=null && boardTokens.length>0){
			for (var numBoardToken = boardTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
				if(	(boardTokens[numBoardToken].x_position==token.x_position && (boardTokens[numBoardToken].y_position==token.y_position-1 || boardTokens[numBoardToken].y_position==token.y_position+1)) ||
					(boardTokens[numBoardToken].y_position==token.y_position && (boardTokens[numBoardToken].x_position==token.x_position-1 || boardTokens[numBoardToken].x_position==token.x_position+1)))
					return true;		        				
			}
		}

		//Board tokens check
		for (var numBoardToken = playerTokens.length - 1; numBoardToken >= 0; numBoardToken--) {
			if(playerTokens[numBoardToken].onBoard && playerTokens[numBoardToken].id != token.id && (previoustoken==null || playerTokens[numBoardToken].id != previoustoken.id))
				if(	(playerTokens[numBoardToken].x_position==token.x_position && (playerTokens[numBoardToken].y_position==token.y_position-1 || playerTokens[numBoardToken].y_position==token.y_position+1)) ||
					(playerTokens[numBoardToken].y_position==token.y_position && (playerTokens[numBoardToken].x_position==token.x_position-1 || playerTokens[numBoardToken].x_position==token.x_position+1)))
					if(isJoinedTokenCheck(boardTokens, playerTokens, playerTokens[numBoardToken], token))
						return true;
		}
		return false;
	}

	function getHorizontalTokens(token, x_position, y_position){
		        			    	
		        	var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

		        	var horizontalTokens = new Array();
			        horizontalTokens.push(token);

			    	//Next
			        var x = x_position+1;
			        var y = y_position;
			        var empty = false;
			        while(!empty && x<config.board.cols){
			        	empty = true;

				        for (var i = boardTokens.length - 1; i >= 0; i--) {
				        	if( boardTokens[i].id != token.id && 
				        		boardTokens[i].x_position == x && boardTokens[i].y_position==y){
					        		boardTokens[i].playerToken = false;
					        	    horizontalTokens.push(boardTokens[i]);
					        		empty = false;
					        		x++;
					        }
					    }

				        for (var i = playerTokens.length - 1; i >= 0; i--) {
				        	if( playerTokens[i].id != token.id && playerTokens[i].onBoard && 
				        		playerTokens[i].x_position == x && playerTokens[i].y_position==y){
					        		playerTokens[i].playerToken = true;
					        		horizontalTokens.push(playerTokens[i]);
					        		empty = false;
					        		x++;
					        }
				        }

			    	}

			    	//Previous
			        x = x_position-1;
			        y = y_position;
			        var empty = false;
			        while(!empty && x>=0){
			        	empty = true;
				        for (var i = boardTokens.length - 1; i >= 0; i--) {
					        if( boardTokens[i].id != token.id && 
					        	boardTokens[i].x_position == x && boardTokens[i].y_position==y){
					        	boardTokens[i].playerToken = false;
					            horizontalTokens.push(boardTokens[i]);
				        		empty = false;
					        	x--;
					        }
				        }

				        for (var i = playerTokens.length - 1; i >= 0; i--) {
					        if( playerTokens[i].id != token.id && playerTokens[i].onBoard && 
					        	playerTokens[i].x_position == x && playerTokens[i].y_position==y){
					        	playerTokens[i].playerToken = true;
					        	horizontalTokens.push(playerTokens[i]);
				        		empty = false;
					        	x--;
					        }
				        }
			    	}

			    	return horizontalTokens;
			    }

	function getVerticalTokens(token, x_position, y_position){
		        			    	
		        	var playerTokens = JSON.parse(sessionStorage.getItem("playerTokens"));
			        var boardTokens = JSON.parse(sessionStorage.getItem("boardTokens"));

		        	var verticalTokens = new Array();
			        verticalTokens.push(token);
			    	//Next
			        y = y_position+1;
			        x = x_position;
			        var empty = false;
			        while(!empty && y<config.board.rows){
			        	empty = true;
				        for (var i = boardTokens.length - 1; i >= 0; i--) {
				        	if( boardTokens[i].id != token.id && 
				        		boardTokens[i].x_position == x && boardTokens[i].y_position==y){
					        	boardTokens[i].playerToken = false;
					            verticalTokens.push(boardTokens[i]);
				        		empty = false;
					        	y++;
					        }
				        }

				        for (var i = playerTokens.length - 1; i >= 0; i--) {
					        if( playerTokens[i].id != token.id && playerTokens[i].onBoard && 
					        	playerTokens[i].x_position == x && playerTokens[i].y_position==y){
						       		playerTokens[i].playerToken = true;
						       		verticalTokens.push(playerTokens[i]);
						       		empty = false;
						       		y++;
						    }
				        }
			    	}

			    	//Previous
			        y = y_position-1;
			        x = x_position;
			        var empty = false;
			        while(!empty && y>=0){
			        	var empty = true;
				        for (var i = boardTokens.length - 1; i >= 0; i--) {
					        if( boardTokens[i].id != token.id && 
					        	boardTokens[i].x_position == x && boardTokens[i].y_position==y){
					        	boardTokens[i].playerToken = false;
					            verticalTokens.push(boardTokens[i]);
					            empty = false;
					        	y--;
					        }
				        }

				        for (var i = playerTokens.length - 1; i >= 0; i--) {
					        if( playerTokens[i].id != token.id && playerTokens[i].onBoard && 
					        	playerTokens[i].x_position == x && playerTokens[i].y_position==y){
						       		playerTokens[i].playerToken = true;
						       		verticalTokens.push(playerTokens[i]);
						       	    empty = false;
						       		y--;
					        }
				        }
			    	}
			    	return verticalTokens;
			    }

	
		       
	

})();