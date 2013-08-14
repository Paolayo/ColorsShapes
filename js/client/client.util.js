colorsShapes.util = (function() {

	return{
		getQueryVariable : function (variable) {
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if (pair[0] == variable) {
					return pair[1];
				}
			}
			alert('Query Variable ' + variable + ' not found');
		},
		redirect : function(urlRedirect, data)
	    {
	    	//Mock option
	    	if(data.dummy){
	    		Dummy.redirect(urlRedirect, data);
	    	}else{
	    		
	    	}
	    },
	    getColor: function (color){
	    	switch(color)
			{
				case 1:
				  return 'blue';
				  break;
				case 2:
				  return 'red';
				  break;
				case 3:
				  return 'orange';
				  break;
				case 4:
				  return 'yellow';
				  break;
				case 5:
				  return 'green';
				  break;
				case 6:
				  return 'pink';
				  break;
				default:
				  return 'white';
			}
	    }
	};
})();