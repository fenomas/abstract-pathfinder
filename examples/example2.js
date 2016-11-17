'use strict'

var Finder = require('..')
var finder = new Finder()


function Node(x, y) {
    this.x = x
    this.y = y
}
var graph = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 9, 9, 0, 0, 0, 0, 0],
    [0, 0, 1, 9, 0, 0, 9, 0],
    [0, 0, 0, 9, 0, 0, 9, 0],
    [0, 0, 0, 0, 9, 9, 9, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
]
var xsize = graph[0].length
var ysize = graph.length

finder.nodeToPrimitive = function (node) {
    return ysize * node.x + node.y
    // return node.x + ',' + node.y  // this would work as well
}

finder.getNeighbors = function (node) {
    var ret = []
    var x = node.x
    var y = node.y
    if (x > 0) ret.push(new Node(x-1, y))
    if (y > 0) ret.push(new Node(x, y-1))
    if (x < xsize - 1) ret.push(new Node(x+1, y))
    if (y < ysize - 1) ret.push(new Node(x, y+1))
    return ret
}

finder.getMovementCost = function (a, b) {
    return 1 + graph[b.y][b.x]
}

finder.getHeuristic = function (a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

var start = new Node(2, 4)
var end = new Node(5, 1)
var path = finder.findPath(start, end)

for (var i = 0; i < path.length; i++) {
    var p = path[i]
    graph[p.y][p.x] = '-'
}
console.log(graph.join('\n'))


