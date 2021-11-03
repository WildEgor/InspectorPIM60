import React, { useState, useEffect } from "react";
import { AppBar, Grid, Link, SvgIcon, Toolbar, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import StyledButton from "Src/components/atoms/StyledButton";
interface HeaderProps {
  isChecked?: (check: boolean) => void;
}

import StyledSwitch from "Src/components/atoms/StyledSwitch";

const Header = (props: HeaderProps) => {
  const { isChecked } = props
  const [auth, setAuth] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  useEffect(() => {
    isChecked && isChecked(auth);
  }, [auth])

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={10} alignSelf='center'>
            <Link href='log.html' underline="hover">
              <StyledButton
                color='secondary' 
                variant="contained"
              >
                <Typography variant='subtitle1'>LOGGER</Typography>
              </StyledButton>
            </Link>
            <Link href='live.html' underline="hover">
              <StyledButton
                color='secondary' 
                variant="contained"
              >
                <Typography variant='subtitle1'>LIVE</Typography>
              </StyledButton>
            </Link>
            <Link href='settings.html' underline="hover">
              <StyledButton
                color='secondary' 
                variant="contained"
              >
                <Typography variant='subtitle1'>SETTINGS</Typography>
              </StyledButton>
            </Link>
            <Link href='recipe.html' underline="hover">
              <StyledButton
                color='secondary' 
                variant="contained"
              >
                <Typography variant='subtitle1'>CHANGE RECIPE</Typography>
              </StyledButton>
            </Link>
            <Link href='supervision.html' underline="hover">
              <StyledButton
                color='secondary' 
                variant="contained"
              >
                <Typography variant='subtitle1'>SUPERVISION</Typography>
              </StyledButton>
            </Link>
          </Grid>
          <Grid item xs={2} alignSelf='center'>
            <StyledSwitch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;