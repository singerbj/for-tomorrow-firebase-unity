import React, { useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { useMouse } from '../hooks/useMouse';
import { ROWS, COLUMNS, GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES, CSS_BUG } from './GridConstants';
import GridItem from './GridItem';

const useStyles = makeStyles({
    grid: {
        position: 'absolute',
        backgroundColor: '#333',
        width: 'min-content',
        paddingTop: SPACE_BETWEEN_SQUARES,
        paddingLeft: SPACE_BETWEEN_SQUARES,
        paddingBottom: CSS_BUG,
    },
    gridRow: {
        backgroundColor: '#333',
        height: GRID_SQUARE_WIDTH,
        width: COLUMNS * GRID_SQUARE_WIDTH + COLUMNS * SPACE_BETWEEN_SQUARES,
        marginBottom: SPACE_BETWEEN_SQUARES,
    },
    gridSquare: {
        display: 'inline-block',
        height: GRID_SQUARE_WIDTH,
        width: GRID_SQUARE_WIDTH,
        marginBottom: SPACE_BETWEEN_SQUARES,
        marginRight: SPACE_BETWEEN_SQUARES,
    },
    transparent: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
});

const getGridPosition = (left, top) => {
    const column = Math.round(left / (GRID_SQUARE_WIDTH + SPACE_BETWEEN_SQUARES));
    const row = Math.round(top / (GRID_SQUARE_WIDTH + SPACE_BETWEEN_SQUARES));
    return [column, row];
};

const Grid = () => {
    const classes = useStyles();
    const [gridState] = useState([...new Array(COLUMNS)].map(() => []));
    const [movingGridItemData, setMovingGridItemData] = useState(undefined);
    const [windowMouseDown, setWindowMouseDown] = useState(false);
    const boundingRectRef = useRef();
    const gridOffset = boundingRectRef.current ? [boundingRectRef.current.getBoundingClientRect().x, boundingRectRef.current.getBoundingClientRect().y] : null;

    const onMouseUp = () => {
        setWindowMouseDown(false);
        setMovingGridItemData(undefined);
    };
    const onMouseDown = () => setWindowMouseDown(true);

    const [position] = useMouse(onMouseDown, onMouseUp);

    const placeGridItem = (gridItemPosition, size) => {
        const [column, row] = getGridPosition(gridItemPosition[0], gridItemPosition[1]);
        console.log(gridState, column, row, size);
    };

    let columnToHighlight;
    let rowToHighlight;
    if (movingGridItemData) {
        [columnToHighlight, rowToHighlight] = getGridPosition(position.x - movingGridItemData[0][0] - gridOffset[0], position.y - movingGridItemData[0][1] - gridOffset[1]);
    }

    return (
        <>
            <div className={classes.grid} style={{ zIndex: 1 }} ref={boundingRectRef}>
                {[...new Array(ROWS)].map((i, j) => {
                    const highlightRow = rowToHighlight !== undefined && j >= rowToHighlight && j < rowToHighlight + movingGridItemData[1][1];
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={`${i} ${j}`} className={classes.gridRow}>
                            {[...new Array(COLUMNS)].map((k, l) => {
                                const highlightColumn = columnToHighlight !== undefined && l >= columnToHighlight && l < columnToHighlight + movingGridItemData[1][0];

                                let backgroundColor = ((j % 2) + l) % 2 === 0 ? '#fff' : '#ccc';
                                if (highlightRow && highlightColumn) {
                                    backgroundColor = '#2b2';
                                }
                                // eslint-disable-next-line react/no-array-index-key
                                return <div key={`${k} ${l}`} className={classes.gridSquare} style={{ backgroundColor }} />;
                            })}
                        </div>
                    );
                })}
            </div>

            <GridItem location={[2, 2]} size={[1, 1]} gridOffset={gridOffset} mousePosition={[position.x, position.y]} placeGridItem={placeGridItem} setMovingGridItemData={setMovingGridItemData} windowMouseDown={windowMouseDown} />
            <GridItem location={[3, 3]} size={[1, 3]} gridOffset={gridOffset} mousePosition={[position.x, position.y]} placeGridItem={placeGridItem} setMovingGridItemData={setMovingGridItemData} windowMouseDown={windowMouseDown} />
            <GridItem location={[4, 4]} size={[2, 2]} gridOffset={gridOffset} mousePosition={[position.x, position.y]} placeGridItem={placeGridItem} setMovingGridItemData={setMovingGridItemData} windowMouseDown={windowMouseDown} />
            <GridItem location={[10, 10]} size={[4, 7]} gridOffset={gridOffset} mousePosition={[position.x, position.y]} placeGridItem={placeGridItem} setMovingGridItemData={setMovingGridItemData} windowMouseDown={windowMouseDown} />
            <GridItem location={[14, 3]} size={[5, 2]} gridOffset={gridOffset} mousePosition={[position.x, position.y]} placeGridItem={placeGridItem} setMovingGridItemData={setMovingGridItemData} windowMouseDown={windowMouseDown} />

            {gridState}
        </>
    );
};

export default Grid;
