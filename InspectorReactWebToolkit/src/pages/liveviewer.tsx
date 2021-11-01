import React, { useReducer } from "react";
import { render } from "react-dom";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  createTheme,
  Theme,
  responsiveFontSizes,
  adaptV4Theme,
} from '@mui/material/styles';
import { lightTheme, darkTheme } from 'Src/style/muiTheme';
import { RootStoreProvider } from "Src/core/store/rootStore";

import App from 'Src/components/pages/LiveViewer'
// import Notifier from "Src/components/organism/Notifier/Notifier";
import Layout  from "Src/components/templates/Layout/Layout";
import { Flip, ToastContainer } from "react-toastify";
import { Box } from "@mui/material";
import Header from "Src/components/organism/Header";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


// import Header from "Src/components/pages/Header";

function LivePage () {
  const [useDefaultTheme, toggle] = useReducer((theme) => !theme, false);
  // define custom theme
  let theme: Theme = createTheme(adaptV4Theme(useDefaultTheme ? lightTheme : darkTheme));
  theme = responsiveFontSizes(theme);

  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <RootStoreProvider>
            <Layout toggleTheme={toggle} useDefaultTheme={useDefaultTheme}>
              {/* <Notifier/> */}
              <ToastContainer
                limit={3}
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
              <Box width={660}>
                <Header/>
                <App/>
              </Box> 
            </Layout>
          </RootStoreProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </React.StrictMode>
  );
}

render(
  <LivePage/>,
  document.getElementById("live")
);
