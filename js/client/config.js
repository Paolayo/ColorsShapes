var config = {};

config.serverPath = 'http://localhost:8000';
config.engine = 'colorsShapes';
config.gameid = '';

config.tile = {size : 32};

config.board= {	x_begin: 0,
				y_begin: config.tile.size*2,
				rows:20,
				cols:20};

config.playerBoard= {	x_begin: 0,
						y_begin: 0};

//module.exports = config;