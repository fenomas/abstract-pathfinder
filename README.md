# abstract-pathfinder

Completely agnostic A* pathfinding. 

Doesn't care how your data is structured. Just implement a minimal set of accessors, 
and this module will apply [A*](https://en.wikipedia.org/wiki/A*_search_algorithm) 
to whatever data or graph you're using.

### Installation:

```shell
npm i --save abstract-pathfinder
```

### Usage:

```js
var Pathfinder = require('abstract-pathfinder')
var finder = new Pathfinder()

// implement stuff
finder.nodeToPrimitive = function (node) { ... }
finder.getNeighbors = function (node) { ... }
finder.getMovementCost = function (nodeA, nodeB) { ... }
finder.getHeuristic = function (nodeA, nodeB) { ... }

// specify two nodes and find a path
var path = finder.findPath(startNode, endNode)
```

Note that `node` here means an whatever you're using to represent 
positions in the graph you're findind a path through.
Nodes can be any type, as long as you implement the methods consistently.

Details:

 * `nodeToPrimitive` should return a **string or number** (uniquely) for the given node 
 * `getNeighbors` should return an **array of nodes** directly accessible from the given one 
 * `getMovementCost` should return a **number** for the cost of moving between neighboring nodes. 
    Negative costs mean that movement is impossible.
 * `getHeuristic` should return a [A* heuristic](http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html) **number**. 
   Typically this means a lower limit of the total cost of moving between the two (not necessarily neighboring) nodes.
 * `findPath` returns an array of nodes, or `[]` if no path was found 


See the `examples` folder for some working demos. 
Example 1 uses strings for nodes; Example 2 uses objects.

### By:

Copyright Andy Hall, 2016. MIT license.
