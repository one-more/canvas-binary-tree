import Point from './point';

function getTreeHeight(tree): number {
  return nodeHeight(tree.root);
}

function nodeHeight(node): number {
  if (node.left && node.right) {
    return 1 + Math.max(
      nodeHeight(node.left),
      nodeHeight(node.right),
    )
  }
  if (node.left) {
    return 1 + nodeHeight(node.left);
  }
  if (node.right) {
    return 1 + nodeHeight(node.right);
  }
  return 1;
}

export default class PositionsTree {
  width: number;
  height: number;
  center: number;
  levelHeight: number;
  treeHeight: number;
  radius: number;
  root: Point;
  xOffset: number;
  positions: Point[] = [];

  constructor(
    private tree,
    private canvas,
  ) {
    this.init();
    this.calculateRoot()
  }

  init(): void {
    const {offsetWidth, offsetHeight} = this.canvas;
    this.width = offsetWidth;
    this.height = offsetHeight;
    this.center = offsetWidth / 2;
    const treeHeight = getTreeHeight(this.tree);
    this.treeHeight = treeHeight;
    this.levelHeight = Math.min(
      (offsetHeight * 0.9) / treeHeight,
      40,
    );
    this.radius = offsetWidth * 0.024;
    this.xOffset = this.width * 0.11;
  }

  calculateRoot(): void {
    this.root = this.calculateNodePosition(
      this.tree.root,
      this.center,
      this.height * 0.05,
      0,
    );
    this.detectCollisions(this.root);
  }

  calculateNodePosition(node, x, y, index): Point {
    const point = new Point(
      x,
      y,
      this.radius,
      node.value,
      node,
    );
    this.positions[index] = point;
    if (node.left) {
      point.left = this.calculateNodePosition(
        node.left,
        x - this.xOffset,
        y + this.levelHeight,
        2 * index + 1,
      );
      point.left.parent = point;
    }
    if (node.right) {
      point.right = this.calculateNodePosition(
        node.right,
        x + this.xOffset,
        y + this.levelHeight,
        2 * index + 2,
      );
      point.right.parent = point;
    }
    return point;
  }

  detectCollisions(point: Point): void {
    if (point.left) {
      const collisions = this.detectCollision(point.left);
      if (collisions.length) {
        const [point1, point2] = collisions;
        this.resolveCollisions(point1, point2);
      }
      this.detectCollisions(point.left);
    }
    if (point.right) {
      const collisions = this.detectCollision(point.right);
      if (collisions.length) {
        const [point1, point2] = collisions;
        this.resolveCollisions(point1, point2);
      }
      this.detectCollisions(point.right);
    }
  }

  detectCollision(point: Point): Point[] {
    const {length} = this.positions;
    for (let i = 0; i < length; i++) {
      const leaf = this.positions[i];
      if (leaf && leaf !== point) {
        const dx = point.x - leaf.x;
        const dy = point.y - leaf.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < point.radius + leaf.radius) {
          return [leaf, point];
        }
      }
    }
    return [];
  }

  resolveCollisions(point1: Point, point2: Point): void {
    const distance1 = Math.abs(point1.x - point1.parent.x);
    const distance2 = Math.abs(point2.x - point2.parent.x);
    const minOffset = this.radius * 2 + 4;
    const parent1 = point1.parent;
    const parent2 = point2.parent;
    const offset1 = Math.min(
      distance1 / 2,
      minOffset,
    );
    const offset2 = Math.min(
      distance2 / 2,
      minOffset,
    );
    if (this.isRootChild(point1) || this.isRootChild(point2)) {
      this.xOffset *= 2;
      this.calculateRoot();
    }
    if (distance1 <= minOffset || distance2 <= minOffset) {
      this.resolveCollisions(parent1, parent2)
    }
    this.reduceChildDistance(parent1, offset1);
    this.reduceChildDistance(parent2, offset2);
  }

  reduceChildDistance(point: Point, distance: number): void {
    if (point.left) {
      point.left.x = point.x - distance;
      this.reduceChildDistance(point.left, distance);
    }
    if (point.right) {
      point.right.x = point.x + distance;
      this.reduceChildDistance(point.right, distance);
    }
  }

  isRootChild(point: Point): boolean {
    if (!this.root) {
      return false;
    }
    return point === this.root.left || point === this.root.right;
  }
}