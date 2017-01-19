interface Node {
  x: number,
  y: number
}

interface IDictionary {
  [key : string] : Node
}

export class AStar {
  static d : number = 1;
  static grid : Array<Node>;

  constructor(map : Array <Node>) {
    AStar.grid = map;
  }

 public calculatePath () {
   let openSet : Array<Node>;
   let closedSet : Array<Node>;
   let cameFrom : IDictionary;
 };

 private calculateDistance(curNode : Node, goal : Node) {
   let dx : number = Math.abs(curNode.x - goal.x);
   let dy : number = Math.abs(curNode.y - goal.y);
   return AStar.d * (dx + dy);
 }
}