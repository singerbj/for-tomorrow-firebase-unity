import React from 'react';
import { HashRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { AppContextWrapper } from './AppContext';
import Routes from './Routes';
import SnackBarManager from './SnackBarManager';

// import { getCurrentUser } from './FirebaseHelper';
const useStyles = makeStyles((theme) => {
    return {
        box: {
            display: 'flex',
            flexDirection: 'column',
        },
        boxSmall: {
            display: 'flex',
            flexDirection: 'column',
        },
        container: {
            flex: '1 auto',
            overflow: 'auto',
            paddingTop: theme.spacing(),
            paddingBottom: theme.spacing(),
        },
        version: {
            position: 'fixed',
            left: 0,
            bottom: 0,
            paddingLeft: theme.spacing(),
            paddingRight: theme.spacing(),
            zIndex: 99999,
            background: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
        },
    };
});

const App = ({ currentUser }) => {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Box className={currentUser ? classes.boxSmall : classes.box}>
                <Box className={classes.container}>
                    <Routes />
                    <SnackBarManager />
                </Box>
            </Box>
            <Box className={classes.version}>
                <Typography variant="overline">PRE-ALPHA</Typography>
            </Box>
        </>
    );
};

App.propTypes = {
    currentUser: PropTypes.any,
};

const AppContainer = () => {
    const theme = createTheme({});

    return (
        <HashRouter>
            <AppContextWrapper
                renderContent={(currentUser) => {
                    return (
                        <ThemeProvider theme={theme}>
                            <App currentUser={currentUser} />
                        </ThemeProvider>
                    );
                }}
            />
        </HashRouter>
    );
};

export default AppContainer;
