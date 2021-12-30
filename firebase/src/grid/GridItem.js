import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES, R_KEY, BACKSPACE_DELETE_KEY, LEFT_MOUSE_BUTTON } from './GridConstants';
import { getGridPosition, hexToRgb } from './GridUtils';
import { validatePosition } from '../shared/grid/GridManagement';

const useStyles = makeStyles((theme) => {
    return {
        item: {
            backgroundColor: 'rgb(85, 85, 187, 1)',
            zIndex: 3,
            position: 'absolute',
            padding: theme.spacing(0.5),
            userSelect: 'none',
        },
        itemDragging: {
            backgroundColor: 'rgb(85, 85, 187, 0.25)',
            zIndex: 5,
            position: 'absolute',
            padding: theme.spacing(0.5),
            userSelect: 'none',
        },
        highlightValid: {
            backgroundColor: 'rgb(85, 187, 85, 0.75)',
            zIndex: 4,
            position: 'absolute',
            padding: theme.spacing(0.5),
            userSelect: 'none',
        },
        highlightInvalid: {
            backgroundColor: 'rgb(187, 85, 85, 0.75)',
            zIndex: 4,
            position: 'absolute',
            padding: theme.spacing(0.5),
            userSelect: 'none',
        },
    };
});

const GridItem = ({ gridState, gridItem, gridOffset, mousePosition, placeGridItem, deleteGridItem, windowMouseDown, resetCounter }) => {
    const classes = useStyles();
    const [mouseDownPositon, setMouseDownPositon] = useState(undefined);
    const mouseDownPositionRef = useRef(mouseDownPositon);
    mouseDownPositionRef.current = mouseDownPositon;
    const dragging = windowMouseDown && mouseDownPositon !== undefined;
    const [localRotation, setLocalRotation] = useState(gridItem.rotated);

    const localRotationRef = useRef(localRotation);
    localRotationRef.current = localRotation;

    const size = localRotation ? [...gridItem.size].reverse() : gridItem.size;

    let left = gridItem.location[0] * GRID_SQUARE_WIDTH + gridItem.location[0] * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[0] : 0);
    let top = gridItem.location[1] * GRID_SQUARE_WIDTH + gridItem.location[1] * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[1] : 0);

    const width = size[0] * GRID_SQUARE_WIDTH + (size[0] - 1) * SPACE_BETWEEN_SQUARES;
    const height = size[1] * GRID_SQUARE_WIDTH + (size[1] - 1) * SPACE_BETWEEN_SQUARES;

    let highlightLeft;
    let highlightTop;
    let highlightValid;
    if (dragging) {
        if (gridItem.rotated === localRotationRef.current || gridItem.size[0] === gridItem.size[1]) {
            left += mousePosition[0] - mouseDownPositon[0];
            top += mousePosition[1] - mouseDownPositon[1];
        } else {
            left = mousePosition[0] + window.scrollX - (size[0] * GRID_SQUARE_WIDTH) / 2;
            top = mousePosition[1] + window.scrollY - (size[1] * GRID_SQUARE_WIDTH) / 2;
        }

        const [x, y] = getGridPosition(left - gridOffset[0], top - gridOffset[1]);
        highlightLeft = x * GRID_SQUARE_WIDTH + x * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[0] : 0);
        highlightTop = y * GRID_SQUARE_WIDTH + y * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[1] : 0);

        highlightValid = validatePosition(gridState, { ...gridItem, location: [x, y], rotated: localRotation });
    }

    useEffect(() => {
        setLocalRotation(gridItem.rotated);
    }, [resetCounter]);

    useEffect(() => {
        if (windowMouseDown === false) {
            setMouseDownPositon(undefined);
        }
    }, [windowMouseDown]);

    useEffect(() => {
        const cb = (e) => {
            if (mouseDownPositionRef.current !== undefined) {
                if (R_KEY.indexOf(e.key) > -1) {
                    setLocalRotation(!localRotationRef.current);
                } else if (BACKSPACE_DELETE_KEY.indexOf(e.key) > -1) {
                    deleteGridItem(gridItem.uuid);
                }
            }
        };
        window.addEventListener('keydown', cb);
        return () => {
            window.removeEventListener('keydown', cb);
        };
    }, []);

    const onMouseDown = (e) => {
        if (e.button === LEFT_MOUSE_BUTTON) {
            setMouseDownPositon(mousePosition);
        }
    };

    const onMouseUp = () => {
        setMouseDownPositon(undefined);
        placeGridItem(getGridPosition(left - gridOffset[0], top - gridOffset[1]), gridItem.location, localRotationRef.current);
    };

    if (gridOffset === null) {
        return null;
    }

    const randomSeededRGBString = hexToRgb(Math.floor(Math.abs(Math.sin(parseInt(`12345${size[0]}${size[1]}`)) * 16777215)).toString(16));
    return (
        <>
            {dragging && <div className={highlightValid ? classes.highlightValid : classes.highlightInvalid} style={{ top: highlightTop, left: highlightLeft, width, height }} />}
            <div className={dragging ? classes.itemDragging : classes.item} style={{ top, left, width, height, backgroundColor: `rgb(${randomSeededRGBString}, ${dragging ? 0.25 : 1})` }} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                {`Item ${gridItem.uuid}`}
            </div>
        </>
    );
};

GridItem.propTypes = {
    gridState: PropTypes.object.isRequired,
    gridItem: PropTypes.object.isRequired,
    gridOffset: PropTypes.array,
    mousePosition: PropTypes.array.isRequired,
    placeGridItem: PropTypes.any.isRequired,
    deleteGridItem: PropTypes.any.isRequired,
    windowMouseDown: PropTypes.bool.isRequired,
    resetCounter: PropTypes.number.isRequired,
};

export default GridItem;
