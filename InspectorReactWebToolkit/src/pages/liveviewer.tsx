import React, { useReducer } from "react";
import { render } from "react-dom";
import { ThemeProvider as MuiThemeProvider, createMuiTheme, Theme, responsiveFontSizes } from '@material-ui/core/styles'
import { lightTheme, darkTheme } from '../style/muiTheme';
import { RootStoreProvider } from "../core/store/rootStore";

import App from '../components/pages/LiveViewer/App'
import Notifier from "../components/organism/Notifier/Notifier";
import Layout  from "../components/templates/Layout/Layout";
import { Flip, ToastContainer } from "react-toastify";

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
            {/* <Notifier/> */}
            <ToastContainer
              transition={Flip}
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <App/>
          </Layout>
        </RootStoreProvider>
      </MuiThemeProvider>
    </React.StrictMode>
  )
}

render(
  <Main/>,
  document.getElementById("live")
);
