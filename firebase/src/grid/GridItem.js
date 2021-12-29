import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES, R_KEY } from './GridConstants';
import { getGridPosition } from './GridUtils';

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
            backgroundColor: 'rgb(85, 85, 187, 0.5)',
            zIndex: 4,
            position: 'absolute',
            padding: theme.spacing(0.5),
            userSelect: 'none',
        },
    };
});

const GridItem = ({ gridItem, gridOffset, mousePosition, placeGridItem, windowMouseDown, resetCounter }) => {
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

    if (dragging) {
        if (gridItem.rotated === localRotationRef.current || gridItem.size[0] === gridItem.size[1]) {
            left += mousePosition[0] - mouseDownPositon[0];
            top += mousePosition[1] - mouseDownPositon[1];
        } else {
            left = mousePosition[0] + window.scrollX - (size[0] * GRID_SQUARE_WIDTH) / 2;
            top = mousePosition[1] + window.scrollY - (size[1] * GRID_SQUARE_WIDTH) / 2;
        }
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
            if (e.keyCode === R_KEY) {
                if (mouseDownPositionRef.current !== undefined) {
                    setLocalRotation(!localRotationRef.current);
                }
            }
        };
        window.addEventListener('keypress', cb);
        return () => {
            window.removeEventListener('keypress', cb);
        };
    }, []);

    const onMouseDown = () => {
        setMouseDownPositon(mousePosition);
    };

    const onMouseUp = () => {
        setMouseDownPositon(undefined);
        placeGridItem(getGridPosition(left - gridOffset[0], top - gridOffset[1]), gridItem.location, localRotationRef.current);
    };

    if (gridOffset === null) {
        return null;
    }
    return (
        <div className={dragging ? classes.itemDragging : classes.item} style={{ top, left, width, height }} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            {`${gridItem.uuid} - ${localRotation}`}
        </div>
    );
};

GridItem.propTypes = {
    gridItem: PropTypes.object.isRequired,
    gridOffset: PropTypes.array,
    mousePosition: PropTypes.array.isRequired,
    placeGridItem: PropTypes.any.isRequired,
    windowMouseDown: PropTypes.bool.isRequired,
    resetCounter: PropTypes.number.isRequired,
};

export default GridItem;
