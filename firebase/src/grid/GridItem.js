import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES } from './GridConstants';
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

const GridItem = ({ gridItem, setGridItem, gridOffset, mousePosition, placeGridItem, setMovingGridItemLocation, setMovingGridItemSize, windowMouseDown }) => {
    const classes = useStyles();
    const [mouseDownPositon, setMouseDownPositon] = useState(undefined);
    const mouseDownPositionRef = useRef(mouseDownPositon);
    mouseDownPositionRef.current = mouseDownPositon;
    const dragging = windowMouseDown && mouseDownPositon !== undefined;

    const gridItemRef = useRef(gridItem);
    gridItemRef.current = gridItem;

    const size = gridItem.rotated ? [...gridItem.size].reverse() : gridItem.size;

    let left = gridItem.location[0] * GRID_SQUARE_WIDTH + gridItem.location[0] * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[0] : 0);
    let top = gridItem.location[1] * GRID_SQUARE_WIDTH + gridItem.location[1] * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[1] : 0);
    const width = size[0] * GRID_SQUARE_WIDTH + (size[0] - 1) * SPACE_BETWEEN_SQUARES;
    const height = size[1] * GRID_SQUARE_WIDTH + (size[1] - 1) * SPACE_BETWEEN_SQUARES;

    if (dragging) {
        left += mousePosition[0] - mouseDownPositon[0];
        top += mousePosition[1] - mouseDownPositon[1];
    }

    useEffect(() => {
        if (windowMouseDown === false) {
            setMovingGridItemLocation(undefined);
            setMovingGridItemSize(undefined);
            setMouseDownPositon(undefined);
        }
    }, [windowMouseDown]);

    useEffect(() => {
        if (gridItem.uuid === '99') {
            console.log(123, gridItem);
        }
    }, [gridItem.rotated]);

    useEffect(() => {
        const cb = (e) => {
            // use e.keyCode
            if (e.keyCode === 114) {
                if (mouseDownPositionRef.current !== undefined) {
                    setGridItem({ ...gridItemRef.current, rotated: !gridItemRef.current.rotated });
                    setMovingGridItemSize(!gridItemRef.current.rotated ? [...gridItemRef.current.size].reverse() : gridItemRef.current.size);
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
        setMovingGridItemLocation([mousePosition[0] - left, mousePosition[1] - top]);
        setMovingGridItemSize(size);
    };

    const onMouseUp = () => {
        setMovingGridItemLocation(undefined);
        setMovingGridItemSize(undefined);
        setMouseDownPositon(undefined);
        placeGridItem(getGridPosition(left - gridOffset[0], top - gridOffset[1]), gridItem.location, gridItem.rotated);
    };

    if (gridOffset === null) {
        return null;
    }
    return (
        <div className={dragging ? classes.itemDragging : classes.item} style={{ top, left, width, height }} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            {`${gridItem.uuid} - ${gridItem.rotated}`}
        </div>
    );
};

GridItem.propTypes = {
    gridItem: PropTypes.object.isRequired,
    setGridItem: PropTypes.any.isRequired,
    gridOffset: PropTypes.array,
    mousePosition: PropTypes.array.isRequired,
    placeGridItem: PropTypes.any.isRequired,
    setMovingGridItemLocation: PropTypes.any.isRequired,
    setMovingGridItemSize: PropTypes.any.isRequired,
    windowMouseDown: PropTypes.bool.isRequired,
};

export default GridItem;
