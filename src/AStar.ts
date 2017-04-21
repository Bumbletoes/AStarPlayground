import { AStarGameTile, TILE_MODES } from './Game';
import { Gameboard, Tile, Point } from './Gameboard';

interface Node extends AStarGameTile {
  f: number, // g + h
  g: number, // cost it took to get here
  h: number, //guess at how much it'll cost to get to the goal
  parent: Node
};

interface IDictionary {
  [key: string]: Node
};

export class AStar {
  private static _d: number = 1;
  private _gameBoard: Gameboard;

  constructor(gamebBoard: Gameboard) {
    this._gameBoard = gamebBoard;
  }

  public calculatePath(start: Tile, finish: Tile): Array<AStarGameTile> {
    let cameFrom: IDictionary;
    let startNode: Node;
    let finishNode: Node;
    let currentNode: Node; // item with the least f cost
    let openSet: Array<Node> = new Array();
    let closedSet: Array<Node> = new Array();
    let path: Array<AStarGameTile> = new Array();
    let currentPathNode: Node;

    startNode = <Node>start;
    startNode.f = 0;
    startNode.g = 0;
    startNode.h = 0;

    finishNode = <Node>finish;

    openSet.push(startNode);

    while (openSet.length != 0) {
      openSet.sort((a: Node, b: Node) => {
        return a.f - b.f;
      });

      if (openSet.length > 0) {
        currentNode = openSet.shift();
        console.log("currentNode:", currentNode);
      }

      closedSet.push(currentNode);
      currentNode.color = '#00EEEE';
      this._gameBoard.drawTile(currentNode);
      if (this._isOnList(finishNode, closedSet)) {
        openSet = new Array();
        currentPathNode = finishNode;
        path.push(finishNode);
        while (currentPathNode !== startNode) {
          currentPathNode = currentPathNode.parent;
          path.push(currentPathNode);
        }
        return path;
      }

      currentNode.neighbors.forEach((tileLocation: Point) => {
        let neighbor: Node = <Node>this._gameBoard.getTile(tileLocation);
        let newG: number;

        if (neighbor === finishNode) {
          finishNode.parent = currentNode;
          closedSet.push(finishNode);
          return;
        } else if (neighbor.tileMode === TILE_MODES.BLOCK || this._isOnList(neighbor, closedSet)) {
          return;
        } else {
          if (this._isOnList(neighbor, openSet) === false) {
            neighbor.g = currentNode.g + this._calculateDistance(neighbor, currentNode);
            neighbor.h = this._calculateDistance(neighbor, finishNode);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = currentNode;
            openSet.push(neighbor);
          } else { // If it's already on the open list
            newG = currentNode.g + this._calculateDistance(neighbor, currentNode);
            if (newG < neighbor.g) { // See if this path is better
              neighbor.g = newG;
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = currentNode;
            }
          }
        }
      });
    }

    return path;
  };

  private _isOnList(node: Node, list: Array<Node>): Boolean {
    list.forEach((currentNode: Node) => {
      if (currentNode === node) {
        return true;
      }
    });
    return false;
  };

  private _calculateDistance(curNode: Node, goal: Node) {
    let dx: number = Math.abs(curNode.position.x - goal.position.x);
    let dy: number = Math.abs(curNode.position.y - goal.position.y);
    return AStar._d * (dx + dy);
  };
}