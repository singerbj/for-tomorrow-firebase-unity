/* eslint-disable no-unused-vars */
import { ROWS, COLUMNS } from '../../grid/GridConstants';

export const constructGrid = (gridState = []) => {
    const grid = [...new Array(ROWS)].map(() => [...new Array(COLUMNS)].map(() => null));
    gridState.forEach((gridItem) => {
        for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
            for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
                grid[j][i] = gridItem.uuid;
            }
        }
    });
    return grid;
};
export const deleteGridItem = (gridState, gridItemLocation, preConstructedGrid) => {
    let error;
    let grid = preConstructedGrid;
    if (!preConstructedGrid) {
        grid = constructGrid(gridState);
    }
    const gridItem = gridState.find((gridItemToCheck) => gridItemToCheck.uuid === grid[gridItemLocation[1]][gridItemLocation[0]]);
    if (!gridItem) {
        error = 'Grid Item not found to delete.';
    }
    for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
        for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
            grid[j][i] = gridItem.uuid;
        }
    }
    return [error, grid, gridItem];
};

export const addGridItem = (gridState, gridItem, preConstructedGrid) => {
    let error;
    let grid = preConstructedGrid;
    if (!preConstructedGrid) {
        grid = constructGrid(gridState);
    }
    for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
        for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
            if (j < 0 || j > ROWS - 1 || i < 0 || i > COLUMNS - 1) {
                error = "Cannot move Grid Item here - you've gone off the grid.";
                break;
            }
            if (grid[j][i] !== null && grid[j][i] !== gridItem.uuid) {
                error = 'Cannot move Grid Item here - spot already taken.';
                break;
            }
            grid[j][i] = gridItem.uuid;
        }
    }
    return [error, grid, gridItem];
};

export const moveGridItem = (gridState, newGridItemLocation, oldGridItemLocation, rotated) => {
    const results = deleteGridItem(gridState, oldGridItemLocation, constructGrid(gridState));
    let [error, grid] = results;
    const movedGridItem = results[2];
    let movedGridItemCopy = { ...movedGridItem };
    if (!error) {
        movedGridItemCopy.location = newGridItemLocation;
        movedGridItemCopy.rotated = rotated;
        [error, grid, movedGridItemCopy] = addGridItem(gridState, movedGridItemCopy, grid);
        if (!error) {
            return gridState.map((gridItem) => {
                if (gridItem.uuid === movedGridItemCopy.uuid) {
                    return {
                        ...gridItem,
                        location: newGridItemLocation,
                        rotated,
                    };
                }
                return gridItem;
            });
        }
    }
    if (error) {
        console.error(error);
    }
    return gridState;
};
