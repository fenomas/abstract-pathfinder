interface Methods<T> {
    nodeToPrimitive: (node: T) => PropertyKey;
    getNeighbors: (node: T) => T[];
    getMoveCost: (a: T, b: T) => number;
    getHeuristic: (a: T, b: T) => number;
}
export declare class Pathfinder<T> {
    methods: Methods<T>;
    maxIterations: number;
    constructor(params?: Partial<Methods<T>>);
    findPath(start: T, goal: T): T[];
}
export {};
