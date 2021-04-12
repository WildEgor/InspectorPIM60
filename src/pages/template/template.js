import React from 'react';
import { StoreProvider } from 'easy-peasy';
import { ThemeProvider } from '@emotion/react';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'

import store from 'Store';
import theme from 'Style/theme';
import muiTheme from 'Style/muiTheme';

import NormalizeStyle from 'Style/normalize';
import GlobalStyle from 'Style/global';

import { SnackbarProvider } from 'notistack';
import Slide from '@material-ui/core/Slide';

import SnackMessage from 'Components/SnackMessage';

const AppWrapper = (props) => 
{
  const notistackRef = React.createRef();
  //const onClickDismiss = key => () => { notistackRef.current.closeSnackbar(key) }

  return (
      <StoreProvider store={store}>
          <ThemeProvider theme={theme}>
            <MuiThemeProvider theme={muiTheme}>
              <SnackbarProvider 
                dense
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                TransitionComponent={Slide}
                content={(key, msg) => (
                    <SnackMessage type={msg.variant} id={key} message={msg.m} error={msg.e}/>
                )}
                ref={notistackRef}
                // action={(key) => (
                //   <button onClick={onClickDismiss(key)}>
                //       X
                //   </button>
                // )}
                maxSnack={4}
                // preventDuplicate
                // persist
                // iconVariant={{
                //   success: '✅',
                //   error: '✖️',
                //   warning: '⚠️',
                //   info: 'ℹ️',
                // }}
              >
                <NormalizeStyle />
                <GlobalStyle />
                  {props.children}
              </SnackbarProvider>
            </MuiThemeProvider>
          </ThemeProvider>
      </StoreProvider>
  )
}

export default AppWrapper