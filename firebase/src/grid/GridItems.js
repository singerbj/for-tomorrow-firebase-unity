import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getAuth } from 'firebase/auth';
import { useMouse } from '../hooks/useMouse';
import GridItem from './GridItem';

import { watchDoc, moveItem, deleteGridItem } from '../FirebaseHelper';
import { AppContext } from '../AppContext';

const { moveGridItem } = require('../shared/GridManagement');

const GridItems = ({ boundingRectRef }) => {
    const { showError } = useContext(AppContext);
    const [gridState, setGridState] = useState({});
    const gridStateRef = useRef(gridState);
    gridStateRef.current = gridState;
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

    useEffect(() => {
        watchDoc(
            'userData',
            getAuth().currentUser.uid,
            (snapshot) => {
                setGridState(snapshot.inventory);
                setResetCounter((rc) => rc + 1);
            },
            (err) => {
                showError(err);
            }
        );
    }, []);

    const onMouseUp = () => {
        setWindowMouseDown(false);
    };
    const onMouseDown = () => setWindowMouseDown(true);

    const [position] = useMouse(onMouseDown, onMouseUp);

    const placeGridItem = (newGridItemLocation, oldGridItemLocation, rotated) => {
        const [error, newState] = moveGridItem(gridStateRef.current, newGridItemLocation, oldGridItemLocation, rotated);
        if (error) {
            setResetCounter((rc) => rc + 1);
        } else {
            try {
                moveItem(newGridItemLocation, oldGridItemLocation, rotated);
            } catch (e) {
                showError(e);
            }
        }
        setGridState(newState);
    };

    const removeGridItem = (uuid) => {
        const oldState = { ...gridStateRef.current };
        delete oldState[uuid];
        setGridState(oldState);
        deleteGridItem(uuid);
    };

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
                        removeGridItem={removeGridItem}
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
