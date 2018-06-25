export default class Point {
  left: Point;
  right: Point;
  parent: Point;

  constructor(
    public x,
    public y,
    public radius,
    public value,
    public node,
  ) {}
}