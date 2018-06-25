"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var point_1 = __importDefault(require("./point"));
function getTreeHeight(tree) {
    return nodeHeight(tree.root);
}
function nodeHeight(node) {
    if (node.left && node.right) {
        return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
    }
    if (node.left) {
        return 1 + nodeHeight(node.left);
    }
    if (node.right) {
        return 1 + nodeHeight(node.right);
    }
    return 1;
}
var PositionsTree = /** @class */ (function () {
    function PositionsTree(tree, canvas) {
        this.tree = tree;
        this.canvas = canvas;
        this.positions = [];
        this.init();
        this.calculateRoot();
    }
    PositionsTree.prototype.init = function () {
        var _a = this.canvas, offsetWidth = _a.offsetWidth, offsetHeight = _a.offsetHeight;
        this.width = offsetWidth;
        this.height = offsetHeight;
        this.center = offsetWidth / 2;
        var treeHeight = getTreeHeight(this.tree);
        this.treeHeight = treeHeight;
        this.levelHeight = Math.min((offsetHeight * 0.9) / treeHeight, 40);
        this.radius = offsetWidth * 0.024;
        this.xOffset = this.width * 0.11;
    };
    PositionsTree.prototype.calculateRoot = function () {
        this.root = this.calculateNodePosition(this.tree.root, this.center, this.height * 0.05, 0);
        this.detectCollisions(this.root);
    };
    PositionsTree.prototype.calculateNodePosition = function (node, x, y, index) {
        var point = new point_1.default(x, y, this.radius, node.value, node);
        this.positions[index] = point;
        if (node.left) {
            point.left = this.calculateNodePosition(node.left, x - this.xOffset, y + this.levelHeight, 2 * index + 1);
            point.left.parent = point;
        }
        if (node.right) {
            point.right = this.calculateNodePosition(node.right, x + this.xOffset, y + this.levelHeight, 2 * index + 2);
            point.right.parent = point;
        }
        return point;
    };
    PositionsTree.prototype.detectCollisions = function (point) {
        if (point.left) {
            var collisions = this.detectCollision(point.left);
            if (collisions.length) {
                var point1 = collisions[0], point2 = collisions[1];
                this.resolveCollisions(point1, point2);
            }
            this.detectCollisions(point.left);
        }
        if (point.right) {
            var collisions = this.detectCollision(point.right);
            if (collisions.length) {
                var point1 = collisions[0], point2 = collisions[1];
                this.resolveCollisions(point1, point2);
            }
            this.detectCollisions(point.right);
        }
    };
    PositionsTree.prototype.detectCollision = function (point) {
        var length = this.positions.length;
        for (var i = 0; i < length; i++) {
            var leaf = this.positions[i];
            if (leaf && leaf !== point) {
                var dx = point.x - leaf.x;
                var dy = point.y - leaf.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < point.radius + leaf.radius) {
                    return [leaf, point];
                }
            }
        }
        return [];
    };
    PositionsTree.prototype.resolveCollisions = function (point1, point2) {
        var distance1 = Math.abs(point1.x - point1.parent.x);
        var distance2 = Math.abs(point2.x - point2.parent.x);
        var minOffset = this.radius * 2 + 4;
        var parent1 = point1.parent;
        var parent2 = point2.parent;
        var offset1 = Math.min(distance1 / 2, minOffset);
        var offset2 = Math.min(distance2 / 2, minOffset);
        if (this.isRootChild(point1) || this.isRootChild(point2)) {
            this.xOffset *= 2;
            this.calculateRoot();
        }
        if (distance1 <= minOffset || distance2 <= minOffset) {
            this.resolveCollisions(parent1, parent2);
        }
        this.reduceChildDistance(parent1, offset1);
        this.reduceChildDistance(parent2, offset2);
    };
    PositionsTree.prototype.reduceChildDistance = function (point, distance) {
        if (point.left) {
            point.left.x = point.x - distance;
            this.reduceChildDistance(point.left, distance);
        }
        if (point.right) {
            point.right.x = point.x + distance;
            this.reduceChildDistance(point.right, distance);
        }
    };
    PositionsTree.prototype.isRootChild = function (point) {
        if (!this.root) {
            return false;
        }
        return point === this.root.left || point === this.root.right;
    };
    return PositionsTree;
}());
exports.default = PositionsTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaWl0b25zLXRyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcG9zaWl0b25zLXRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBNEI7QUFFNUIsdUJBQXVCLElBQUk7SUFDekIsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxvQkFBb0IsSUFBSTtJQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtRQUMzQixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNqQixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUNyQixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUN2QixDQUFBO0tBQ0Y7SUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDYixPQUFPLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDO0lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuQztJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEO0lBV0UsdUJBQ1UsSUFBSSxFQUNKLE1BQU07UUFETixTQUFJLEdBQUosSUFBSSxDQUFBO1FBQ0osV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQUpoQixjQUFTLEdBQVksRUFBRSxDQUFDO1FBTXRCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUN0QixDQUFDO0lBRUQsNEJBQUksR0FBSjtRQUNRLElBQUEsZ0JBQXlDLEVBQXhDLDRCQUFXLEVBQUUsOEJBQVksQ0FBZ0I7UUFDaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7UUFDekIsSUFB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