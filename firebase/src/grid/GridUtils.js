import { GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES } from './GridConstants';

export const getGridPosition = (left, top) => {
    const column = Math.round(left / (GRID_SQUARE_WIDTH + SPACE_BETWEEN_SQUARES));
    const row = Math.round(top / (GRID_SQUARE_WIDTH + SPACE_BETWEEN_SQUARES));
    return [column, row];
};
