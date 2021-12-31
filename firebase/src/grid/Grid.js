import React, { useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { ROWS, COLUMNS, GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES, CSS_BUG } from '../shared/GridConstants';
import GridItems from './GridItems';

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
});

const Grid = () => {
    const classes = useStyles();
    const boundingRectRef = useRef();
    return (
        <>
            <div className={classes.grid} style={{ zIndex: 1 }} ref={boundingRectRef}>
                {[...new Array(ROWS)].map((i, j) => {
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={`${i} ${j}`} className={classes.gridRow}>
                            {[...new Array(COLUMNS)].map((k, l) => {
                                const backgroundColor = ((j % 2) + l) % 2 === 0 ? '#fdfdfd' : '#ddd';
                                // eslint-disable-next-line react/no-array-index-key
                                return <div key={`${k} ${l}`} className={classes.gridSquare} style={{ backgroundColor }} />;
                            })}
                        </div>
                    );
                })}
            </div>
            <GridItems boundingRectRef={boundingRectRef} />
        </>
    );
};

export default Grid;
