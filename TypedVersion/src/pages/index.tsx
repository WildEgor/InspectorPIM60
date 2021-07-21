import React, { useReducer } from "react";
import { render } from "react-dom";
import {ThemeProvider as MuiThemeProvider, createMuiTheme, Theme, responsiveFontSizes} from '@material-ui/core/styles'
import { lightTheme, darkTheme } from '../style/muiTheme';
import App from '../components/App/App'
import { RootStoreProvider } from "../core/store/rootStore";
import Notifier from "../components/Notifier/Notifier";

import Layout  from "../components/Layout/Layout";

function Main() {
  const [useDefaultTheme, toggle] = useReducer((theme) => !theme, true);
  // define custom theme
  let theme: Theme = createMuiTheme(useDefaultTheme ? lightTheme : darkTheme);
  theme = responsiveFontSizes(theme);

  return(
    <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <RootStoreProvider>
        <Layout toggleTheme={toggle} useDefaultTheme={useDefaultTheme}>
          <App/>
          <Notifier/>
        </Layout>
      </RootStoreProvider>
    </MuiThemeProvider>
  </React.StrictMode>
  )
}

render(
  <Main/>,
  document.getElementById("root")
);
