interface Point {
  x: number,
  y: number
};
export interface Grid extends Array<Array<Tile>> { };

export interface Tile {
  position: Point,
  color: string,
  neighbors: Array<Point>
};

export class TILE_COLORS {
  public static INITIAL_COLOR: string = '#FFF';
  public static NEIGHBOR_COLOR: string = '#0000EE';
}

export class Gameboard {
  // Canvas properties
  private _STROKE_COLOR: string = '#000';
  private _CANVAS_ID: string = 'gameboard';
  private _LINE_WIDTH: number = 1;
  private _BORDER_STYLE: string = '1px solid #000';
  private _FILL_COLOR_OFFSET: number = 1; // Offset so the fill color accounts for the line width
  private _FILL_COLOR_SIZE: number = this._LINE_WIDTH + 1; // Magic number for fill color size accounting for line size

  private _TILE_SIZE: number = 32;


  private _canvas: HTMLCanvasElement;
  private _tiles: Grid;
  private _context: CanvasRenderingContext2D;
  private _tileClickHandler: Function;

  /**
   * Represents the gamboard
   * @constructor
   */
  constructor(height: number, width: number, tileClickHandler: Function) {
    let numColumns: number = width / this._TILE_SIZE;
    let numRows: number = height / this._TILE_SIZE;

    this._initCanvas(height, width);
    this._tiles = this._initTiles(numColumns, numRows);
    this._tileClickHandler = tileClickHandler;
  };

  /**
   * Rewdraw the entire board
   */
  public drawBoard() {
    this.apply((tile: Tile) => {
      this.drawTile(tile);
    });
  };

  /**
   * Apply a function to all tiles.
   * @param func {Function} - function to apply to all tiles
   */
  public apply(func: Function) {
    this._tiles.forEach((tileArray: Array<Tile>) => {
      tileArray.forEach((tile: Tile) => {
        func(tile);
      });
    });
  };

  private _getTile(tilePosition: Point): Tile {
    if (this._tileExists(tilePosition)) {
      return this._tiles[tilePosition.x][tilePosition.y];
    }
    return undefined;
  }

  private _tileExists(tilePosition: Point): boolean {
    return this._tiles[tilePosition.x] !== undefined && this._tiles[tilePosition.x][tilePosition.y] !== undefined;
  }

  /**
   * Initialization logic for the canvas. Handles setting up the context and
   * adds the canvas element to the dom
   * @param height {number} - height of the canvas
   * @param width {number} - width of the canvas
   */
  private _initCanvas(height: number, width: number) {
    this._canvas = document.createElement('canvas');
    this._canvas.id = this._CANVAS_ID;
    this._canvas.height = height;
    this._canvas.width = width;
    this._canvas.style.border = this._BORDER_STYLE;

    this._context = this._canvas.getContext('2d');
    this._context.lineWidth = this._LINE_WIDTH;
    this._context.strokeStyle = this._STROKE_COLOR;
    document.body.appendChild(this._canvas);

    this._canvas.addEventListener('selectstart', (e) => { e.preventDefault(); return false; }, false);
    this._canvas.addEventListener('mousedown', (e) => {
      let globalCoords: Point = { x: e.pageX - this._canvas.offsetLeft, y: e.pageY - this._canvas.offsetTop };
      let tile: Tile = this._getTile(this._globalCoordToTileCoord(globalCoords));
      if (tile) {
        this._handleTileClick(tile);
      }
    }, true);
  };

  private _handleTileClick(tile: Tile) {
    if (this._tileClickHandler) {
      this._tileClickHandler(tile);
    }
  };

  /**
   * Converts global coords of the board to the local tile location in the grid array
   * @param point {Point} - global x,y coordinate from the canvas
   */
  private _globalCoordToTileCoord(point: Point): Point {
    return { x: Math.floor(point.x / this._TILE_SIZE), y: Math.floor(point.y / this._TILE_SIZE) };
  };

  /**
   * Initialization logic for tiles. Returns a 2 dimensional array containing
   * the tiles.
   * @param numColumns {number} - number of columns in the grid
   * @param numRows {number} - number of rows in the grid
   */
  private _initTiles(numColumns: number, numRows: number): Grid {
    let tiles: Grid;
    let neighbors: Array<Point>;
    let i: number = 0;
    let j: number = 0;

    tiles = new Array(numRows);
    for (i; i < numColumns; i++) {
      j = 0;
      for (j; j < numRows; j++) {
        if (tiles[i] === undefined) {
          tiles[i] = new Array();
        }

        neighbors = this._getNeighbors({ x: i, y: j }, numColumns, numRows);
        tiles[i][j] = { position: { x: i, y: j }, color: TILE_COLORS.INITIAL_COLOR, neighbors: neighbors };
      }
    }

    return tiles;
  };

  /**
   * Helper function for building the neighbors property for a tile.
   * @param tilePosition {Point} - position of the parent tile
   */
  private _getNeighbors(tilePosition: Point, numColumns: number, numRows: number): Array<Point> {
    let neighbors: Array<Point> = new Array();
    let neighborPositions: Array<Point> = [
      { x: -1, y: 1 }, // upper left
      { x: 0, y: 1 }, // upper
      { x: 1, y: 1 }, // upper right
      { x: -1, y: 0 }, // middle left
      { x: 1, y: 0 }, // middle right
      { x: -1, y: -1 }, // bottom left
      { x: 0, y: -1 }, // bottom
      { x: 1, y: -1 } // bottom right
    ];

    neighborPositions.forEach((location: Point) => {
      let neighborLocation: Point = { x: location.x + tilePosition.x, y: location.y + tilePosition.y };
      // exclude tiles that are not on the board
      if (neighborLocation.x >= 0 &&
        neighborLocation.y >= 0 &&
        neighborLocation.x < numColumns &&
        neighborLocation.y < numRows) {
        neighbors.push(neighborLocation);
      }
    });

    return neighbors;
  };

  /**
   * Helper function for drawing tiles. Takes a point to draw the tile at.
   * Offset based on width and height of the tile are taken into account.
   * @param position {Tile} - tile to draw
   */
  public drawTile(tile: Tile) {
    let globalPosition: Point;

    if (this._tileExists(tile.position)) {
      globalPosition = { x: tile.position.x * this._TILE_SIZE, y: tile.position.y * this._TILE_SIZE };

      this._context.clearRect(globalPosition.x, globalPosition.y, this._TILE_SIZE, this._TILE_SIZE);
      this._context.strokeRect(globalPosition.x,
        globalPosition.y,
        this._TILE_SIZE,
        this._TILE_SIZE);

      this._context.fillStyle = tile.color;
      this._context.fillRect(globalPosition.x + this._LINE_WIDTH,
        globalPosition.y + this._LINE_WIDTH,
        this._TILE_SIZE - this._FILL_COLOR_SIZE,
        this._TILE_SIZE - this._FILL_COLOR_SIZE);
    }
  };
}