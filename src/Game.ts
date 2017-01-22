import { Gameboard, Tile, Grid, TILE_COLORS } from './Gameboard'

enum TILE_MODES {
  EMPTY,
  START,
  END,
  BLOCK
}

interface AStarGameTile extends Tile {
  tileMode: number
}

class ASTAR_TILE_COLORS extends TILE_COLORS {
  public static BLOCKING_COLOR: string = '#000';
  public static END_COLOR: string = '#EE0000';
  public static START_COLOR: string = '#00EE00';
};

export class Game {
  private CLEAR_BUTTON_ID = 'clearButton';
  private CLEAR_BUTTON_TEXT = 'Clear Board';

  private _gameBoard: Gameboard;
  private _startTile: AStarGameTile;
  private _endTile: AStarGameTile;

  constructor() {
    this._gameBoard = new Gameboard(576, 1024, (tile: Tile) => {
      this._toggleTileMode(<AStarGameTile>tile);
    });
    this._initializeAstarTiles();
    this._initButtons();
    this._gameBoard.drawBoard();
  };

  public clearGameBoard() {
    this._startTile = undefined;
    this._endTile = undefined;
    this._initializeAstarTiles();
    this._gameBoard.drawBoard();
  };

  private _initButtons() {
    let clearButton: HTMLElement;
    clearButton = document.createElement('button');
    clearButton.innerHTML = this.CLEAR_BUTTON_TEXT;
    clearButton.id = this.CLEAR_BUTTON_ID;
    clearButton.style.display = 'block';
    document.body.appendChild(clearButton);
    clearButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.clearGameBoard();
    });
  }

  private _initializeAstarTiles() {
    this._gameBoard.apply((tile: AStarGameTile) => {
      tile.color = TILE_COLORS.INITIAL_COLOR;
      tile.tileMode = TILE_MODES.EMPTY;
    });
  };

  private _toggleTileMode(tile: AStarGameTile) {
    tile.tileMode++;

    if (this._startTile === tile) {
      this._startTile = undefined;
    } else if (this._startTile !== undefined &&
      tile.tileMode === TILE_MODES.START) { // Skip start if it's already set
      tile.tileMode++;
    }

    if (this._endTile === tile) {
      this._endTile = undefined;
    } else if (this._endTile !== undefined &&
      tile.tileMode === TILE_MODES.END) {// Skip end if it's already set
      tile.tileMode++;
    }

    switch (tile.tileMode) {
      case TILE_MODES.EMPTY:
        tile.color = ASTAR_TILE_COLORS.INITIAL_COLOR;
        break;
      case TILE_MODES.START:
        this._setStartTile(tile);
        break;
      case TILE_MODES.END:
        this._setEndTile(tile);
        break;
      case TILE_MODES.BLOCK:
        tile.color = ASTAR_TILE_COLORS.BLOCKING_COLOR;
        break;
      default:
        tile.tileMode = tile.tileMode > TILE_MODES.BLOCK ? TILE_MODES.EMPTY : tile.tileMode;
        tile.color = ASTAR_TILE_COLORS.INITIAL_COLOR;
    }

    this._gameBoard.drawTile(tile);
  }

  private _setStartTile(tile: AStarGameTile) {
    if (this._startTile !== undefined) { // There can be only one start tile
      this._startTile.tileMode = TILE_MODES.EMPTY;
      this._startTile.color = ASTAR_TILE_COLORS.INITIAL_COLOR;
      this._gameBoard.drawTile(this._startTile);
    }
    tile.color = ASTAR_TILE_COLORS.START_COLOR;
    this._startTile = tile;
  }

  private _setEndTile(tile: AStarGameTile) {
    if (this._endTile !== undefined) {
      this._endTile.tileMode = TILE_MODES.EMPTY;
      this._endTile.color = ASTAR_TILE_COLORS.INITIAL_COLOR;
      this._gameBoard.drawTile(this._endTile);
    }
    tile.color = ASTAR_TILE_COLORS.END_COLOR;
    this._endTile = tile;
  }
}