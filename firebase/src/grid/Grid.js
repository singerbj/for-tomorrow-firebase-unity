import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useMouse } from '../hooks/useMouse';
import { ROWS, COLUMNS, GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES, CSS_BUG, TEST_STATE } from './GridConstants';
import GridItem from './GridItem';
import { getGridPosition } from './GridUtils';
import { moveGridItem } from '../shared/grid/GridManagement';

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

const Grid = () => {
    const classes = useStyles();
    const [gridState, setGridState] = useState(JSON.parse(localStorage.getItem('gridState')) || TEST_STATE);
    const [movingGridItemLocation, setMovingGridItemLocation] = useState(undefined);
    const [movingGridItemSize, setMovingGridItemSize] = useState(undefined);
    const [windowMouseDown, setWindowMouseDown] = useState(false);
    const boundingRectRef = useRef();
    const [gridOffset, setGridOffset] = useState(null);

    useEffect(() => {
        setGridOffset([boundingRectRef.current.getBoundingClientRect().x + window.scrollX, boundingRectRef.current.getBoundingClientRect().y + window.scrollY]);
    }, [boundingRectRef]);

    const onMouseUp = () => {
        setWindowMouseDown(false);
        setMovingGridItemLocation(undefined);
        setMovingGridItemSize(undefined);
    };
    const onMouseDown = () => setWindowMouseDown(true);

    const [position] = useMouse(onMouseDown, onMouseUp);

    const placeGridItem = (newGridItemLocation, oldGridItemLocation, rotated) => {
        const newState = moveGridItem(gridState, newGridItemLocation, oldGridItemLocation, rotated);
        console.log(
            gridState.find((o) => o.uuid === '99'),
            newState.find((o) => o.uuid === '99')
        );
        setGridState(newState);
    };

    useEffect(() => {
        localStorage.setItem('gridState', JSON.stringify(gridState));
    }, [gridState]);

    let columnToHighlight;
    let rowToHighlight;
    if (movingGridItemLocation) {
        [columnToHighlight, rowToHighlight] = getGridPosition(position.x - movingGridItemLocation[0] - gridOffset[0], position.y - movingGridItemLocation[1] - gridOffset[1]);
    }

    return (
        <>
            <div className={classes.grid} style={{ zIndex: 1 }} ref={boundingRectRef}>
                {[...new Array(ROWS)].map((i, j) => {
                    const highlightRow = rowToHighlight !== undefined && j >= rowToHighlight && j < rowToHighlight + movingGridItemSize[1];
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={`${i} ${j}`} className={classes.gridRow}>
                            {[...new Array(COLUMNS)].map((k, l) => {
                                const highlightColumn = columnToHighlight !== undefined && l >= columnToHighlight && l < columnToHighlight + movingGridItemSize[0];

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

            {gridState.map((gridItem) => {
                return (
                    <GridItem
                        boundingRectRef={boundingRectRef}
                        key={gridItem.uuid}
                        gridItem={gridItem}
                        setGridItem={(gridItemData) => {
                            const newState = [...gridState].map((gi) => {
                                if (gi.uuid === gridItem.uuid) {
                                    return gridItemData;
                                }
                                return gi;
                            });
                            setGridState(newState);
                        }}
                        gridOffset={gridOffset}
                        mousePosition={[position.x, position.y]}
                        placeGridItem={placeGridItem}
                        setMovingGridItemLocation={setMovingGridItemLocation}
                        setMovingGridItemSize={setMovingGridItemSize}
                        windowMouseDown={windowMouseDown}
                    />
                );
            })}
        </>
    );
};

export default Grid;
