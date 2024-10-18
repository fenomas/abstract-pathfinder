"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pathfinder = void 0;
const ts_priority_queue_1 = require("ts-priority-queue");
const wrapNode = (node, previous, f = 0, g = 0, open = true) => {
    return { node, previous, f, g, open };
};
class Pathfinder {
    methods;
    maxIterations = 1e6;
    constructor(params = {}) {
        this.methods = {
            nodeToPrimitive: (node) => node,
            getNeighbors: () => [],
            getMovementCost: () => 1,
            getHeuristic: () => 1,
            ...params,
        };
    }
    findPath(start, goal) {
        const startKey = this.methods.nodeToPrimitive(start);
        const goalKey = this.methods.nodeToPrimitive(goal);
        const open = new ts_priority_queue_1.default({ comparator: (a, b) => a.f - b.f });
        const visited = {};
        const startNode = wrapNode(start, null, 0, 0, true);
        open.queue(startNode);
        visited[startKey] = startNode;
        let ct = 0;
        while (open.length > 0) {
            if (ct++ > this.maxIterations)
                throw new Error('Infinite loop!');
            const curr = open.dequeue();
            if (!curr.open)
                continue;
            const currKey = this.methods.nodeToPrimitive(curr.node);
            if (currKey === goalKey)
                break;
            curr.open = false;
            this.methods.getNeighbors(curr.node).forEach((neighbor) => {
                const moveCost = this.methods.getMovementCost(curr.node, neighbor);
                if (moveCost < 0)
                    return;
                const neighborKey = this.methods.nodeToPrimitive(neighbor);
                const nnode = visited[neighborKey];
                const cost = curr.g + moveCost;
                if (nnode && nnode.g <= cost)
                    return;
                const h = this.methods.getHeuristic(neighbor, goal);
                if (nnode) {
                    nnode.open = true;
                    nnode.g = cost;
                    nnode.f = cost + h;
                    nnode.previous = curr;
                    open.queue(nnode);
                }
                else {
                    const newnode = wrapNode(neighbor, curr, cost + h, cost, true);
                    visited[neighborKey] = newnode;
                    open.queue(newnode);
                }
            });
        }
        open.clear();
        const end = visited[goalKey];
        if (!end)
            return [];
        const path = [end.node];
        let p = end;
        while (p.previous) {
            path.push(p.previous.node);
            p = p.previous;
        }
        return path.reverse();
    }
}
exports.Pathfinder = Pathfinder;
