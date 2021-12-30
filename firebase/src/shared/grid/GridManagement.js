import { ROWS, COLUMNS } from '../../grid/GridConstants';

const _constructGrid = (gridState = []) => {
    const grid = [...new Array(ROWS)].map(() => [...new Array(COLUMNS)].map(() => null));
    Object.keys(gridState).forEach((uuid) => {
        const gridItem = gridState[uuid];
        for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
            for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
                grid[j][i] = gridItem.uuid;
            }
        }
    });
    return grid;
};

const _deleteGridItem = (gridState, gridItemLocation, preConstructedGrid) => {
    let error;
    let grid = preConstructedGrid;
    if (!preConstructedGrid) {
        grid = _constructGrid(gridState);
    }
    const gridItem = gridState[grid[gridItemLocation[1]][gridItemLocation[0]]];
    if (!gridItem) {
        error = 'Grid Item not found to delete.';
    }
    for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
        for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
            grid[j][i] = null;
        }
    }
    return [error, grid, gridItem];
};

const _addGridItem = (gridState, gridItem, preConstructedGrid) => {
    let error;
    let grid = preConstructedGrid;
    if (!preConstructedGrid) {
        grid = _constructGrid(gridState);
    }
    for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
        for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
            if (!error) {
                if (j < 0 || j > ROWS - 1 || i < 0 || i > COLUMNS - 1) {
                    error = "Cannot move Grid Item here - you've gone off the grid.";
                    break;
                }
                if (grid[j][i] !== null && grid[j][i] !== gridItem.uuid) {
                    error = 'Cannot move Grid Item here - spot already taken.';
                    break;
                }
            }
        }
    }
    if (!error) {
        for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
            for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
                if (!error) {
                    grid[j][i] = gridItem.uuid;
                }
            }
        }
    }
    return [error, grid, gridItem];
};

export const moveGridItem = (gridState, newGridItemLocation, oldGridItemLocation, rotated) => {
    let grid = _constructGrid(gridState);
    const results = _deleteGridItem(gridState, oldGridItemLocation, grid);
    let error;
    [error, grid] = results;
    const movedGridItem = results[2];
    let movedGridItemCopy = { ...movedGridItem };
    if (!error) {
        movedGridItemCopy.location = newGridItemLocation;
        movedGridItemCopy.rotated = rotated;
        [error, grid, movedGridItemCopy] = _addGridItem(gridState, movedGridItemCopy, grid);
        if (!error) {
            return [
                error,
                {
                    ...gridState,
                    [movedGridItemCopy.uuid]: {
                        ...movedGridItemCopy,
                    },
                },
            ];
        }
    }
    if (error) {
        console.error(error);
    }
    return [error, gridState];
};

export const validatePosition = (gridState, gridItem) => {
    let isValid = true;
    const grid = _constructGrid(gridState);
    for (let i = gridItem.location[0]; i < gridItem.location[0] + gridItem.size[gridItem.rotated ? 1 : 0]; i += 1) {
        for (let j = gridItem.location[1]; j < gridItem.location[1] + gridItem.size[gridItem.rotated ? 0 : 1]; j += 1) {
            if (isValid) {
                if (j < 0 || j > ROWS - 1 || i < 0 || i > COLUMNS - 1) {
                    isValid = false;
                    break;
                }
                if (grid[j][i] !== null && grid[j][i] !== gridItem.uuid) {
                    isValid = false;
                    break;
                }
            }
        }
    }
    return isValid;
};
