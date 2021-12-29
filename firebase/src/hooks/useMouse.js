import { useEffect, useState } from 'react';

export const useMouse = (onMouseDownCallback, onMouseUpCallback) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const cb = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', cb);

        return () => {
            window.removeEventListener('mousemove', cb);
        };
    }, []);

    useEffect(() => {
        window.addEventListener('mousedown', (e) => {
            setMouseDown(true);
            if (onMouseDownCallback) {
                onMouseDownCallback({ x: e.clientX, y: e.clientY });
            }
        });

        return () => {
            window.removeEventListener('mousedown', (e) => {
                if (onMouseDownCallback) {
                    onMouseDownCallback({ x: e.clientX, y: e.clientY });
                }
            });
        };
    }, [onMouseDownCallback]);

    useEffect(() => {
        window.addEventListener('mouseup', (e) => {
            setMouseDown(false);
            if (onMouseUpCallback) {
                onMouseUpCallback({ x: e.clientX, y: e.clientY });
            }
        });

        return () => {
            window.removeEventListener('mouseup', (e) => {
                if (onMouseUpCallback) {
                    onMouseUpCallback({ x: e.clientX, y: e.clientY });
                }
            });
        };
    }, [onMouseUpCallback]);

    return [position, mouseDown];
};
