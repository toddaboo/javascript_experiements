
function addItem(list, item) {
	var ul = document.getElementById(list);
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(item));
	li.className = "list-group-item";
	ul.appendChild(li);
}

var cypher_query;

function myFunction() {

cypher_query = document.getElementById("cypher").value;

//var cypher_query = document.getElementById("cypher").value;
//var cypher_query = 'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100';

var g = {
      nodes: [],
      edges: []
    };

// Instantiate sigma:
var s = new sigma({
  graph: g,
  container: 'graph-container'
});



sigma.neo4j.cypher(
	{ url: 'http://localhost:7474', user: 'neo4j', password: 'admin' },
	cypher_query,
	s, 
	/*{ 	container: 'graph-container',
		settings: {
			enableEdgeHovering: false,
			borderSize: 2,
			outerBorderSize: 3,
			defaultNodeBorderColor: '#fff',
			defaultNodeOuterBorderColor: 'rgb(236, 81, 72)',
			nodeHaloColor: '#0000ff',
		    edgeHaloColor: '#0000ff',
		    nodeHaloSize: 25,
		    edgeHaloSize: 10,
	        doubleClickEnabled: false,
		    minEdgeSize: 0.5,
		    maxEdgeSize: 4,
	        enableEdgeHovering: true,
		    edgeHoverColor: 'edge',
		    defaultEdgeHoverColor: '#000',
		    edgeHoverSizeRatio: 1,
		    edgeHoverExtremities: true
		  }		
	} ,*/
	function() {
		s.refresh();
		/*console.log('Number of nodes :'+ s.graph.nodes().length);
		console.log('Number of edges :'+ s.graph.edges().length);
		
		// Instanciate the ActiveState plugin:
		var activeState = sigma.plugins.activeState(s);

		// Initialize the dragNodes plugin:
		var dragListener = sigma.plugins.dragNodes(s, s.renderers[0], activeState);

		// Initialize the Select plugin:
		var select = sigma.plugins.select(s, activeState);

		// Initialize the Keyboard plugin:
		var keyboard = sigma.plugins.keyboard(s, s.renderers[0]);

		// Bind the Keyboard plugin to the Select plugin:
		select.bindKeyboard(keyboard);

		dragListener.bind('startdrag', function(event) {
		  console.log(event);
		});
		dragListener.bind('drag', function(event) {
		  console.log(event);
		});
		dragListener.bind('drop', function(event) {
		  console.log(event);
		});
		dragListener.bind('dragend', function(event) {
		  console.log(event);
		});
		
		// Initialize the lasso plugin:
		var lasso = new sigma.plugins.lasso(s, s.renderers[0], {
		  'strokeStyle': 'rgb(236, 81, 72)',
		  'lineWidth': 2,
		  'fillWhileDrawing': true,
		  'fillStyle': 'rgba(236, 81, 72, 0.2)',
		  'cursor': 'crosshair'
		});

		select.bindLasso(lasso);
		lasso.activate();

		// halo on active nodes:
		function renderHalo() {
		  s.renderers[0].halo({
			nodes: activeState.nodes()
		  });
		}

		s.renderers[0].bind('render', function(e) {
		  renderHalo();
		});


		//"spacebar" + "s" keys pressed binding for the lasso tool
		keyboard.bind('32+83', function() {
		  if (lasso.isActive) {
			lasso.deactivate();
		  } else {
			lasso.activate();
		  }
		});

		// Listen for selectedNodes event
		lasso.bind('selectedNodes', function (event) {
		  setTimeout(function() {
			lasso.deactivate();
			s.refresh({ skipIdexation: true });
		  }, 0);
		});

		// Remove duplicates in a specified array.
		// See http://stackoverflow.com/a/1584370
		function arrayUnique(array) {
		  var a = array.concat();
		  for(var i=0; i<a.length; ++i) {
		    for(var j=i+1; j<a.length; ++j) {
		      if(a[i] === a[j])
		        a.splice(j--, 1);
		    }
		  }
		  return a;
		};

		function renderHalo() {
		  s.renderers[0].halo({
		    nodes: s.graph.nodes()
		  });
		}

		renderHalo();

		s.renderers[0].bind('render', function(e) {
		  renderHalo();
		});

		s.bind('clickStage', function(e) {
		  renderHalo();
		});

		s.bind('overNodes', function(e) {
		  var adjacentNodes = [],
		      adjacentEdges = [];

		  // Get adjacent nodes:
		  e.data.nodes.forEach(function(node) {
		    adjacentNodes = adjacentNodes.concat(s.graph.adjacentNodes(node.id));
		  });

		  // Add hovered nodes to the array and remove duplicates:
		  adjacentNodes = arrayUnique(adjacentNodes.concat(e.data.nodes));

		  // Get adjacent edges:
		  e.data.nodes.forEach(function(node) {
		    adjacentEdges = adjacentEdges.concat(s.graph.adjacentEdges(node.id));
		  });

		  // Remove duplicates:
		  adjacentEdges = arrayUnique(adjacentEdges);

		  // Render halo:
		  s.renderers[0].halo({
		    nodes: adjacentNodes,
		    edges: adjacentEdges
		  });
		});

		// Bind the events:
		s.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
		  console.log(e.type, e.data.node.label, e.data.captor);
		});
		s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
		  console.log(e.type, e.data.edge, e.data.captor);
		});
		s.bind('clickStage', function(e) {
		  console.log(e.type, e.data.captor);
		});
		s.bind('doubleClickStage rightClickStage', function(e) {
		  console.log(e.type, e.data.captor);
		});

		var config = {
		  node: {
		  	show: 'overNode',
		    hide: 'outNode',
		    cssClass: 'sigma-tooltip',
		    position: 'top',
		    template: '{{label}}' + ' ' + '{{data.name}}'
		  }
		};

		// Instanciate the tooltips plugin with a Mustache renderer for node tooltips:
		var tooltips = sigma.plugins.tooltips(s, s.renderers[0], config);

		// Manually open a tooltip on a node:
		var n = s.graph.nodes('Person');
		var prefix = s.renderers[0].camera.prefix;
		tooltips.open(n, config.node, n[prefix + 'name'], n[prefix + 'ID']);

		tooltips.bind('shown', function(event) {
		  console.log('tooltip shown', event);
		});

		tooltips.bind('hidden', function(event) {
		  console.log('tooltip hidden', event);
		});*/
	}
);

for(var label in node_labels) {
	addItem("nodes", node_labels[label]);
}

for(var type in edge_types) {
	addItem("rels", edge_types[type]);
}

var nodes = document.getElementById("nodes");
Sortable.create(nodes, { group: "omega" });

var rels = document.getElementById("rels");
Sortable.create(rels, { group: "omega" });

}

var edge_types = [];

// Calling neo4j to get all its relationship type
sigma.neo4j.getTypes(
		{ url: 'http://localhost:7474', user:'neo4j', password:'admin' },
		function(types) {
			console.log("Relationship types " + types);
			edge_types = types;
		}
);

var node_labels = [];

// Calling neo4j to get all its node label
sigma.neo4j.getLabels(
		{ url: 'http://localhost:7474', user:'neo4j', password:'admin' },
		function(labels) {
			console.log("Node labels " + labels);
			node_labels = labels;
		}
);

sigma.renderers.def = sigma.renderers.canvas;

