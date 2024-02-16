const GRID_HEIGHT = 550;
const GRID_WIDTH = 550;
const NUMBER_OF_CELLS = 4;   //number of cells in the grid
const CELL_HEIGHT = GRID_HEIGHT / (NUMBER_OF_CELLS + 2);  //height of an individual cell, +2 to account for t&b margins
const CELL_WIDTH = GRID_WIDTH / (NUMBER_OF_CELLS + 2);    //width of an individual cell, +2 to account for l&r margins

export function cell (x, y) {
    this.left = x;
    this.right = x + CELL_WIDTH;
    this.top = y;
    this.bottom = y + CELL_HEIGHT;
    this.highlightSide = null;
    this.selected = {left: false, right: false, top: false, bottom: false};
    this.owner = {left: null, right: null, top: null, bottom: null};
    this.linesDrawn = 0;
    this.cellOwner = null;

    this.isPartOf = function(x, y) {
        return this.left <= x && this.right > x
            && this.top <= y && this.bottom > y;
    }
}
