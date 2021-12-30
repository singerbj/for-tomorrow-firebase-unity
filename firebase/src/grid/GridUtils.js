/* eslint-disable no-bitwise */
import { GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES } from './GridConstants';

export const getGridPosition = (left, top) => {
    const column = Math.round(left / (GRID_SQUARE_WIDTH + SPACE_BETWEEN_SQUARES));
    const row = Math.round(top / (GRID_SQUARE_WIDTH + SPACE_BETWEEN_SQUARES));
    return [column, row];
};

export const hexToRgb = (hex) => {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r},${g},${b}`;
};
