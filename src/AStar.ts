/*
// A*
initialize the open list
initialize the closed list
put the starting node on the open list (you can leave its f at zero)

while the open list is not empty
    find the node with the least f on the open list, call it "q"
    pop q off the open list
    generate q's 8 successors and set their parents to q
    for each successor
    	if successor is the goal, stop the search
        successor.g = q.g + distance between successor and q
        successor.h = distance from goal to successor
        successor.f = successor.g + successor.h

        if a node with the same position as successor is in the OPEN list \
            which has a lower f than successor, skip this successor
        if a node with the same position as successor is in the CLOSED list \ 
            which has a lower f than successor, skip this successor
        otherwise, add the node to the open list
    end
    push q on the closed list
end
*/
import { Gameboard, Tile } from './Gameboard';

interface Node extends Tile {
  f: number, // g + h
  g: number, // cost it took to get here
  h: number //guess at how much it'll cost to get to the goal
};

interface IDictionary {
  [key: string]: Node
};

export class AStar {
  private static _d: number = 1;
  private  _gameBoard: Gameboard;
  private static _openSet: Array<Node>;
  private static _closedSet: Array<Node>;

  constructor(gamebBoard: Gameboard) {
    this._gameBoard = gamebBoard;
  }

  public calculatePath(start: Tile, finish: Tile) {
    let cameFrom: IDictionary;
    let startNode: Node;
    let q: Node; // item with the least f cost

    startNode.position.x = start.position.x;
    startNode.position.y = start.position.y;
    startNode.f = 0;
    startNode.g = 0;
    startNode.h = 0;

    AStar._openSet.push(startNode);

    while (AStar._openSet.length != 0) {
      AStar._openSet.sort((a: Node, b: Node) => {
        return a.f - b.f;
      });
      
      if (AStar._openSet.length > 0) {
        q = AStar._openSet.shift();
      }

    }
  };

  private _calculateDistance(curNode: Node, goal: Node) {
    let dx: number = Math.abs(curNode.position.x - goal.position.x);
    let dy: number = Math.abs(curNode.position.y - goal.position.y);
    return AStar._d * (dx + dy);
  }
}