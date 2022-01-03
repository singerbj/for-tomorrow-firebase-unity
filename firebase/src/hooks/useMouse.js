import { useEffect, useState } from 'react';

export const useMouse = (onMouseDownCallback, onMouseUpCallback, onTouchStartCallback, onTouchCancelCallback, onTouchEndCallback) => {
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
        const cb = (e) => {
            setMouseDown(false);
            if (onMouseUpCallback) {
                onMouseUpCallback({ x: e.clientX, y: e.clientY });
            }
        };
        window.addEventListener('mouseup', cb);

        return () => {
            window.removeEventListener('mouseup', cb);
        };
    }, [onMouseUpCallback]);

    useEffect(() => {
        const cb = (e) => {
            setMouseDown(true);
            if (onMouseDownCallback) {
                onMouseDownCallback({ x: e.clientX, y: e.clientY });
            }
        };
        window.addEventListener('mousedown', cb);
        return () => {
            window.removeEventListener('mousedown', cb);
        };
    }, [onMouseDownCallback]);

    useEffect(() => {
        const cb = (e) => {
            const evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            const touch = evt.touches[0] || evt.changedTouches[0];
            setPosition({ x: touch.pageX, y: touch.pageY });
        };
        window.addEventListener('touchmove', cb);
        return () => {
            window.removeEventListener('touchmove', cb);
        };
    }, []);

    useEffect(() => {
        const cb = (e) => {
            const evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            const touch = evt.touches[0] || evt.changedTouches[0];
            setMouseDown(true);
            if (onTouchStartCallback) {
                onTouchStartCallback({ x: touch.pageX, y: touch.pageY });
            }
        };
        window.addEventListener('touchstart', cb);
        return () => {
            window.removeEventListener('touchstart', cb);
        };
    }, [onTouchStartCallback]);

    useEffect(() => {
        const cb = (e) => {
            const evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            const touch = evt.touches[0] || evt.changedTouches[0];
            setMouseDown(false);
            if (onTouchCancelCallback) {
                onTouchCancelCallback({ x: touch.pageX, y: touch.pageY });
            }
        };
        window.addEventListener('touchcancel', cb);

        return () => {
            window.removeEventListener('touchcancel', cb);
        };
    }, [onTouchCancelCallback]);

    useEffect(() => {
        const cb = (e) => {
            const evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
            const touch = evt.touches[0] || evt.changedTouches[0];
            setMouseDown(false);
            if (onTouchEndCallback) {
                onTouchEndCallback({ x: touch.pageX, y: touch.pageY });
            }
        };
        window.addEventListener('touchend', cb);

        return () => {
            window.removeEventListener('touchend', cb);
        };
    }, [onTouchEndCallback]);

    return [position, mouseDown];
};
