import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import './firebase/initFirebase';

import './styles/index.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#f6c28b',
			// contrastText: will be calculated to contrast with palette.primary.main
		},
		secondary: {
			main: '#cb4154',
			// dark: will be calculated from palette.secondary.main,
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 700,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<Routes />
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>
);
