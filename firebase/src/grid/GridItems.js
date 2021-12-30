import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMouse } from '../hooks/useMouse';
import { TEST_STATE } from './GridConstants';
import GridItem from './GridItem';
import { moveGridItem } from '../shared/grid/GridManagement';

const GridItems = ({ boundingRectRef }) => {
    const [gridState, setGridState] = useState(JSON.parse(localStorage.getItem('gridState')) || TEST_STATE);
    const gridStateRef = useRef(gridState);
    gridStateRef.current = gridState;
    // const [movingGridItemLocation, setMovingGridItemLocation] = useState(undefined);
    const [windowMouseDown, setWindowMouseDown] = useState(false);
    const [gridOffset, setGridOffset] = useState(null);
    const [resetCounter, setResetCounter] = useState(0);

    useEffect(() => {
        const cb = () => {
            setGridOffset([boundingRectRef.current.getBoundingClientRect().x + window.scrollX, boundingRectRef.current.getBoundingClientRect().y + window.scrollY]);
        };
        cb();
        window.addEventListener('resize', cb);
        return () => {
            window.removeEventListener('resize', cb);
        };
    }, [boundingRectRef]);

    useEffect(() => {}, []);

    const onMouseUp = () => {
        setWindowMouseDown(false);
    };
    const onMouseDown = () => setWindowMouseDown(true);

    const [position] = useMouse(onMouseDown, onMouseUp);

    const placeGridItem = (newGridItemLocation, oldGridItemLocation, rotated) => {
        const [error, newState] = moveGridItem(gridStateRef.current, newGridItemLocation, oldGridItemLocation, rotated);
        if (error) {
            setResetCounter((rc) => rc + 1);
        }
        setGridState(newState);
    };

    const deleteGridItem = (uuid) => {
        const oldState = { ...gridStateRef.current };
        delete oldState[uuid];
        setGridState(oldState);
    };

    useEffect(() => {
        localStorage.setItem('gridState', JSON.stringify(gridState));
    }, [gridState]);

    return (
        <>
            {Object.keys(gridState).map((uuid) => {
                const gridItem = gridState[uuid];
                return (
                    <GridItem
                        boundingRectRef={boundingRectRef}
                        key={gridItem.uuid}
                        gridState={gridState}
                        gridItem={gridItem}
                        gridOffset={gridOffset}
                        mousePosition={[position.x, position.y]}
                        placeGridItem={placeGridItem}
                        deleteGridItem={deleteGridItem}
                        windowMouseDown={windowMouseDown}
                        resetCounter={resetCounter}
                    />
                );
            })}
        </>
    );
};

GridItems.propTypes = {
    boundingRectRef: PropTypes.object.isRequired,
};

export default GridItems;
