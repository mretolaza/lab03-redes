
module.exports.linkstate = async (nodo_base, nodo_fin) => {
  let linkstate = [];

  nodos = []
  eval_nodos = []
  path = []
  
  // global.config = {
  //   node: '',
  // };
  
  //global.config.routes = config.routes;
  
  
  let vertices = [];
  let adjacencyList = {};
  
  // async version, from https://github.com/ReginaF2012/dijkstra_javascript/blob/main/dijkstra.js
  addVertex = (vertex) => {
    vertices.push(vertex);
    adjacencyList[vertex] = {};
  }
  
  // async version, from https://github.com/ReginaF2012/dijkstra_javascript/blob/main/dijkstra.js
  addEdge = (vertex1, vertex2, weight) => {
    adjacencyList[vertex1][vertex2] = weight;
  }
  
  nodos.push(nodo_base)
  await addVertex(nodo_base)
  
  get_neighbors = async  (nodo) => {
    neighbors = global.config.routes.filter( element => element.node === nodo)
    neighbors[0].neighbor.forEach( nb => {
      addEdge(nodo, nb.node, nb.length)
      if (eval_nodos.indexOf(nb.node) == -1) {
        eval_nodos.push(nb.node);
      }
    });
  }
  
  await get_neighbors(nodo_base)
  
  const index = eval_nodos.indexOf(nodo_base)
  eval_nodos.slice(nodo_base, index)
  
  while (Object.keys(eval_nodos).length > 0) {
    eval_nodos.forEach( element => {
      addVertex(element);
      get_neighbors(element);
    }); 
  
    vertices.forEach( vertice => {
      const i = eval_nodos.indexOf(vertice)
      if (i > -1){
        eval_nodos = eval_nodos.filter(el => !vertices.includes(el));
      }    
    });
  }
  
  // async version, from https://github.com/ReginaF2012/dijkstra_javascript/blob/main/dijkstra.js
  changeWeight = async (vertex1, vertex2, weight) => {
    adjacencyList[vertex1][vertex2] = weight;
  }
  
  // async version, from https://github.com/ReginaF2012/dijkstra_javascript/blob/main/dijkstra.js
  dijkstra = async (source) => {
    let distances = {},
        parents = {},
        visited = new Set();
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i] === source) {
            distances[source] = 0;
        } else {
            distances[vertices[i]] = Infinity;
        }
        parents[vertices[i]] = null;
    }
    
    let currVertex = await vertexWithMinDistance(distances, visited);
  
    while (currVertex !== null) {
        let distance = distances[currVertex],
            neighbors = adjacencyList[currVertex];
        for (let neighbor in neighbors) {
            let newDistance = distance + neighbors[neighbor];
            if (distances[neighbor] > newDistance) {
                distances[neighbor] = newDistance;
                parents[neighbor] = currVertex;
            }
        }
        visited.add(currVertex);
        currVertex = await vertexWithMinDistance(distances, visited);
    }
  
    const path = await definir_ruta(parents);
    return path;
    
  }
  
  // async version, from https://github.com/ReginaF2012/dijkstra_javascript/blob/main/dijkstra.js
  vertexWithMinDistance = async (distances, visited) => {
    let minDistance = Infinity,
        minVertex = null;
    for (let vertex in distances) {
        let distance = distances[vertex];
        if (distance < minDistance && !visited.has(vertex)) {
            minDistance = distance;
            minVertex = vertex;
        }
    }
    return minVertex;
  }
  
  definir_ruta = async (parents) => {
    
    path.push(nodo_fin)
    let stop = false
    
    siguiente = (nodo) => {
      let sig = ''
      for(const element in parents) {
        if (element === nodo_fin){
          sig = parents[element]
        }
      }
      return sig
    }
  
    while (!stop) {
      ns = siguiente(nodo_fin)
      if (ns === null) {
        stop = true
      } else {
        path.unshift(ns)
        nodo_fin = ns
      }        
    }
  
    path.splice(path.indexOf(nodo_base), 1);
    
    linkstate = path;
    return path; 
  }


  linkstate = await dijkstra(nodo_base)

  return linkstate;
};

