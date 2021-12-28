import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from './grid/Grid';

const theme = createTheme({});

const App = () => {
    return (
        <>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <Grid />
            </ThemeProvider>
        </>
    );
};

export default App;
