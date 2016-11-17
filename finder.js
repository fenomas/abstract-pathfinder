'use strict'

var Queue = require('js-priority-queue')
module.exports = Finder



function Finder() {

    // methods the user must overwrite:
    this.nodeToPrimitive = function (a) { throw 'Overwrite this method!' }
    this.getNeighbors = function (node) { throw 'Overwrite this method!' }
    this.getMovementCost = function (a, b) { throw 'Overwrite this method!' }
    this.getHeuristic = function (a, b) { throw 'Overwrite this method!' }

    // core functionality
    this.findPath = function (start, goal) {
        var pstart = this.nodeToPrimitive(start)
        var pgoal = this.nodeToPrimitive(goal)

        // init data structures, open start node
        var open = new Queue({ comparator: compareNodes })
        var visited = {}

        var startNode = new Node(start, 0, 0, true, false)
        open.queue(startNode)
        visited[pstart] = startNode

        while (open.length > 0) {
            // get open node with lowest f
            var curr = open.dequeue()
            // node might have been removed from OPEN while it was queued
            while (curr && !curr.open) curr = open.dequeue()

            // exit conditions
            if (!curr || !curr.open) break
            var pcurr = this.nodeToPrimitive(curr.data)
            if (pcurr === pgoal) break

            curr.open = false
            curr.closed = true

            // iterate neighbors, visit or refresh if current cost is lower than previous
            var nabs = this.getNeighbors(curr.data)
            for (var i = 0; i < nabs.length; i++) {
                var ndata = nabs[i]
                var move = this.getMovementCost(curr.data, ndata)
                if (move < 0) continue // impassable barrier
                var cost = curr.g + move

                var pneighbor = this.nodeToPrimitive(ndata)
                var nnode = visited[pneighbor]
                if (nnode) {
                    if (cost < nnode.g) {
                        nnode.open = true
                        nnode.closed = false
                        nnode.g = cost
                        nnode.f = cost + this.getHeuristic(ndata, goal)
                        nnode.parent = curr
                        open.queue(nnode)
                    }
                } else {
                    var h = this.getHeuristic(ndata, goal)
                    var f = cost + h
                    var newnode = new Node(ndata, f, cost, true, false, curr)
                    visited[pneighbor] = newnode
                    open.queue(newnode)
                }
            }
        }

        // build reversed path from goal to start
        var path = []
        var pnode = visited[pgoal]
        if (pnode && pnode.parent) {
            path.push(pnode.data)
            while (pnode.parent) {
                pnode = pnode.parent
                path.push(pnode.data)
            }
        }
        // reverse it, clean up and exit
        var rpath = []
        while (path.length) rpath.push(path.pop())
        open.clear()
        open = null
        visited = null
        return rpath
    }
}



function Node(data, f, g, open, closed, parent) {
    this.f = +f
    this.g = +g
    this.open = !!open
    this.closed = !!closed
    this.parent = parent || null
    this.data = data
}


function compareNodes(a, b) {
    return a.f - b.f
}



