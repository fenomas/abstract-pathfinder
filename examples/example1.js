'use strict'

var Finder = require('..')
var finder = new Finder()


finder.nodeToPrimitive = function (node) { return node }
finder.getMovementCost = function (a, b) { return 1 }
finder.getHeuristic = function (a, b) { return 10 }

finder.getNeighbors = function (node) {
    switch (node) {
        case 'A': return ['B']
        case 'B': return ['A', 'C', 'D']
        case 'C': return ['B', 'D']
        case 'D': return ['C', 'E']
        case 'E': return ['D']
    }
}


var path = finder.findPath('A', 'E')
console.log(path)


