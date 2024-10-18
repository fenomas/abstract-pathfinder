import PriorityQueue from 'ts-priority-queue'

interface WrappedNode<T> {
  node: T // reference to the user-defined node
  previous: WrappedNode<T> | null // where we arrived at this node from
  g: number // cost from start to this node
  f: number // estimated total cost from start to goal, via this node: f=g+h
  open: boolean // whether this node is in the open set
}

const wrapNode = <T>(
  node: T,
  previous: WrappedNode<T> | null,
  f = 0,
  g = 0,
  open = true,
): WrappedNode<T> => {
  return { node, previous, f, g, open }
}

interface Methods<T> {
  nodeToPrimitive: (node: T) => PropertyKey
  getNeighbors: (node: T) => T[]
  getMoveCost: (a: T, b: T) => number
  getHeuristic: (a: T, b: T) => number
}

export class Pathfinder<T> {
  methods: Methods<T>
  maxIterations = 1e6

  constructor(params: Partial<Methods<T>> = {}) {
    this.methods = {
      nodeToPrimitive: (node) => node as unknown as PropertyKey,
      getNeighbors: () => [],
      getMoveCost: () => 1,
      getHeuristic: () => 1,
      ...params,
    }
  }

  findPath(start: T, goal: T): T[] {
    const startKey = this.methods.nodeToPrimitive(start)
    const goalKey = this.methods.nodeToPrimitive(goal)

    // init data structures, open start node
    const open = new PriorityQueue<WrappedNode<T>>({ comparator: (a, b) => a.f - b.f })
    const visited: { [key: PropertyKey]: WrappedNode<T> } = {}

    const startNode = wrapNode(start, null, 0, 0, true)
    open.queue(startNode)
    visited[startKey] = startNode

    let ct = 0
    while (open.length > 0) {
      if (ct++ > this.maxIterations) throw new Error('Infinite loop!')

      // get open node with lowest f
      const curr = open.dequeue()
      // node might have been closed after it got queued
      if (!curr.open) continue

      // exit conditions
      const currKey = this.methods.nodeToPrimitive(curr.node)
      if (currKey === goalKey) break

      // iterate neighbors, visit or refresh if current cost is lower than previous
      curr.open = false
      this.methods.getNeighbors(curr.node).forEach((neighbor) => {
        const moveCost = this.methods.getMoveCost(curr.node, neighbor)
        if (moveCost < 0) return // impassable barrier

        const neighborKey = this.methods.nodeToPrimitive(neighbor)
        const nnode = visited[neighborKey]
        const cost = curr.g + moveCost
        if (nnode && nnode.g <= cost) return // already found a path to this node

        // store or update this node and its cost
        const h = this.methods.getHeuristic(neighbor, goal)
        if (nnode) {
          nnode.open = true
          nnode.g = cost
          nnode.f = cost + h
          nnode.previous = curr
          open.queue(nnode)
        } else {
          const newnode = wrapNode(neighbor, curr, cost + h, cost, true)
          visited[neighborKey] = newnode
          open.queue(newnode)
        }
      })
    }

    // cleanup
    open.clear()

    // if we never visited the goal node then no path was found
    const end = visited[goalKey]
    if (!end) return []

    // build reversed path from goal to start
    const path = [end.node]
    let p = end
    while (p.previous) {
      path.push(p.previous.node)
      p = p.previous
    }
    return path.reverse()
  }
}
