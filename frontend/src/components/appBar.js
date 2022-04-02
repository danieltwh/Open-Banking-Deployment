import * as React from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";


const AppBar = styled(MuiAppBar)(({theme }) => ({
    backgroundColor: alpha("#212121", 0.9),
  }));

export default function AppAppBar() {
  return (
    // <Box sx={{ flexGrow: 1 }}>
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* <Box sx={{ flex: 1 }} /> */}
          <Typography
            variant="h6"
            color="inherit"
            sx={{ fontSize: 24 }}
          >
            Open Banking
          </Typography>
        </Toolbar>
      </AppBar>
      </div>
    // </Box>
  );
}
