import React, { useState, useEffect, createContext, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { onAuthStateChanged, loginWithEmail, logoutOfFirebase, getCurrentUser } from './FirebaseHelper';

const alertMessages = [];
export const AppContext = createContext({ alertMessages: [] });

export const useAppContext = () => useContext(AppContext);

const AppContextWrapper = ({ renderContent }) => {
    const navigate = useNavigate();
    const [appState, setAppState] = useState({
        loading: true,
    });
    const appStateRef = useRef();
    appStateRef.current = appState;
    const [snackPack, setSnackPack] = React.useState([]);
    const addSnack = (message, severity) => {
        if (['error', 'warning'].includes(severity)) {
            alertMessages.push({
                ...appState,
                snackBar: {
                    message,
                    severity,
                },
            });
        }
        setSnackPack((prev) => [
            ...prev,
            {
                ...appState,
                snackBar: {
                    message,
                    severity,
                },
            },
        ]);
    };
    const showSuccess = (message) => addSnack(message, 'success');
    const showInfo = (message) => addSnack(message, 'info');
    const showWarning = (message) => addSnack(message, 'warning');
    const showError = (message) => addSnack(message, 'error');

    const getSnackPack = () => {
        return snackPack;
    };

    const logout = async () => {
        logoutOfFirebase();
    };

    const login = async (email, password) => {
        setAppState({
            ...appState,
            loading: true,
        });
        try {
            const { data } = await loginWithEmail(email, password);
            console.log(data);
        } catch (e) {
            setAppState({
                ...appState,
                loading: false,
            });
            showError('Error logging in. Please try again later.');
        }
    };

    useEffect(() => {
        return onAuthStateChanged(async (user) => {
            if (user) {
                console.log('User is logged in');
                navigate('/');
                setAppState({
                    ...appState,
                    loading: false,
                });
            } else {
                console.log('No User logged in');
                navigate('/login');
                setAppState({
                    ...appState,
                    loading: false,
                });
            }
        });
    }, []);

    return (
        <>
            <AppContext.Provider
                value={{
                    alertMessages,
                    appState,
                    setAppState,
                    snackPack,
                    setSnackPack,
                    showSuccess,
                    showInfo,
                    showWarning,
                    showError,
                    getSnackPack,
                    login,
                    logout,
                }}
            >
                {renderContent(getCurrentUser())}
            </AppContext.Provider>
        </>
    );
};

AppContextWrapper.propTypes = {
    renderContent: PropTypes.func,
};

export { AppContextWrapper };
