import { Gameboard, Grid, Tile } from '../Gameboard';

describe('Gameboard with no listeners ', () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  it('should create a new Gameboard', () => {
    expect(gameboard).not.toBeUndefined();
    expect(gameboard).not.toBeNull();
  });

  it('should contain a 18 by 32 grid', () => {
    let grid: Grid = gameboard.getGrid();
    expect(grid.length).toBe(32);

    grid.forEach((tileArray: Array<Tile>) => {
      expect(tileArray.length).toBe(18);
    });
  });

  it('should apply a function to all tiles', () => {
    let newTileColor: string = '#111';
    gameboard.apply((tile: Tile) => {
      tile.color = newTileColor;
    });

    gameboard.getGrid().forEach((tileArray: Array<Tile>) => {
      tileArray.forEach((tile: Tile) => {
        expect(tile.color).toBe(newTileColor);
      });
    });
  });
});

describe('Gameboard with listeners ', () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard({
      onmousedown: () => { },
      onmousemove: () => { },
      onmouseup: () => { }
    });
  });

  it('should create a new Gameboard', () => {
    expect(gameboard).not.toBeUndefined();
    expect(this.gameboard).not.toBeNull();
  });

  it('should contain a 18 by 32 grid', () => {
    let grid: Grid = gameboard.getGrid();
    expect(grid.length).toBe(32);

    grid.forEach((tileArray: Array<Tile>) => {
      expect(tileArray.length).toBe(18);
    });
  });

  it('should apply a function to all tiles', () => {
    let newTileColor: string = '#111';
    gameboard.apply((tile: Tile) => {
      tile.color = newTileColor;
    });

    gameboard.getGrid().forEach((tileArray: Array<Tile>) => {
      tileArray.forEach((tile: Tile) => {
        expect(tile.color).toBe(newTileColor);
      });
    });
  });

});