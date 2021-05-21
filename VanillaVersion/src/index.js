import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from 'easy-peasy';
import { ThemeProvider } from '@emotion/react';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'

import store from 'store';
import theme from 'style/theme';
import muiTheme from 'style/muiTheme';

import NormalizeStyle from 'style/normalize';
import GlobalStyle from 'style/global';
import App from 'components/App/index';

//import './index.css';

const AppWrapper = () => (
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={muiTheme}>
        <NormalizeStyle />
        <GlobalStyle />
        <App />
      </MuiThemeProvider>
    </ThemeProvider>
  </StoreProvider>
);

ReactDOM.render(<AppWrapper />, document.getElementById('root'));
