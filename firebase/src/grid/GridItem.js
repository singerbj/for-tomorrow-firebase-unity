import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES } from './GridConstants';

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

const GridItem = ({ location, size, gridOffset, mousePosition, placeGridItem, setMovingGridItemData, windowMouseDown }) => {
    const classes = useStyles();
    const [mouseDownPositon, setMouseDownPositon] = useState(undefined);
    const dragging = windowMouseDown && mouseDownPositon !== undefined;

    let left = location[0] * GRID_SQUARE_WIDTH + location[0] * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[0] : 0);
    let top = location[1] * GRID_SQUARE_WIDTH + location[1] * SPACE_BETWEEN_SQUARES + SPACE_BETWEEN_SQUARES + (gridOffset ? gridOffset[1] : 0);
    const width = size[0] * GRID_SQUARE_WIDTH + (size[0] - 1) * SPACE_BETWEEN_SQUARES;
    const height = size[1] * GRID_SQUARE_WIDTH + (size[1] - 1) * SPACE_BETWEEN_SQUARES;

    if (dragging) {
        left += mousePosition[0] - mouseDownPositon[0];
        top += mousePosition[1] - mouseDownPositon[1];
    }

    useEffect(() => {
        if (windowMouseDown === false) {
            setMovingGridItemData(undefined);
            setMouseDownPositon(undefined);
        }
    }, [windowMouseDown]);

    const onMouseDown = () => {
        setMouseDownPositon(mousePosition);
        setMovingGridItemData([[mousePosition[0] - left, mousePosition[1] - top], size]);
    };

    const onMouseUp = () => {
        setMovingGridItemData(undefined);
        setMouseDownPositon(undefined);
        placeGridItem([left - gridOffset[0], top - gridOffset[1]], size);
    };

    if (gridOffset === null) {
        return null;
    }
    return (
        <div className={dragging ? classes.itemDragging : classes.item} style={{ top, left, width, height }} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            Item
        </div>
    );
};

GridItem.propTypes = {
    location: PropTypes.array.isRequired,
    size: PropTypes.array.isRequired,
    gridOffset: PropTypes.array,
    mousePosition: PropTypes.array.isRequired,
    placeGridItem: PropTypes.any.isRequired,
    setMovingGridItemData: PropTypes.any.isRequired,
    windowMouseDown: PropTypes.bool.isRequired,
};

export default GridItem;
