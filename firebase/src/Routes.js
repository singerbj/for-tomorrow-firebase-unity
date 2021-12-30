import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LinearProgress, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AppContext } from './AppContext';
import Grid from './grid/Grid';
import Login from './pages/Login';

const useStyles = makeStyles((theme) => ({
    progressBar: {
        marginBottom: theme.spacing(),
    },
    loading: {
        textAlign: 'center',
        margin: theme.spacing(2),
    },
}));

const App = () => {
    const classes = useStyles();
    const { appState } = useContext(AppContext);

    if (appState.loading) {
        return (
            <>
                <LinearProgress className={classes.progressBar} color="secondary" />
            </>
        );
    }
    return (
        <>
            {/* {JSON.stringify(appState)} */}
            <Container>
                <Routes>
                    <Route path="/" element={<Grid />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Container>
        </>
    );
};
export default App;
