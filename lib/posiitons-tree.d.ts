import Point from './point';
export default class PositionsTree {
    private tree;
    private canvas;
    width: number;
    height: number;
    center: number;
    levelHeight: number;
    treeHeight: number;
    radius: number;
    root: Point;
    xOffset: number;
    positions: Point[];
    constructor(tree: any, canvas: any);
    init(): void;
    calculateRoot(): void;
    calculateNodePosition(node: any, x: any, y: any, index: any): Point;
    detectCollisions(point: Point): void;
    detectCollision(point: Point): Point[];
    resolveCollisions(point1: Point, point2: Point): void;
    reduceChildDistance(point: Point, distance: number): void;
    isRootChild(point: Point): boolean;
}
