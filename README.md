# abstract-pathfinder

Type-agnostic A\* pathfinding.

Doesn't care how your data is structured - just implement a minimal set of accessors,
and this module will apply [A\*](https://en.wikipedia.org/wiki/A*_search_algorithm)
to whatever data or graph you're using.

Now built in typescript! Takes any arbitrary type for the graph nodes.

### Installation:

```shell
pnpm i abstract-pathfinder
```

### Usage:

```ts
import { Pathfinder } from 'abstract-pathfinder'

type MyNodeType = { x: number; y: number } // or whatever

const finder = new Pathfinder<MyNodeType>({
  nodeToPrimitive: (node) => 'a', // unique key for each node
  getNeighbors: (node) => [],     // array of neighboring nodes
  getMoveCost: (a, b) => 1 ,      // move cost between neighboring nodes
  getHeuristic: (a, b) => 1,      // guess at move cost between arbitrary nodes
})

const path = finder.findPath(start, end) // array of nodes, or [] if no path found
```

### By:

Made with 🍺 by [fenomas](https://fenomas.com).
