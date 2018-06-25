# canvas-binary-tree
draw binary tree on canvas

## install
`````
npm i canvas-binary-tree
`````

## usage
````es6
import drawTree from "canvas-binary-tree"

drawTree(canvas, tree)
````

## api
````es6
interface BinaryTreeNode {
  value: any,
  left: BinaryTreeNode,
  right: BinaryTreeNode,
}

interface BinaryTree {
  root: BinaryTreeNode,
}

drawCanvas(
    canvas: HTMLCanvasElement,
    tree: BinaryTree 
)
````