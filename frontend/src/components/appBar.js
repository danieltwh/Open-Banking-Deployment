import * as React from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: alpha("#212121", 0.9),
}));

export default function AppAppBar() {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          color="inherit"
          sx={{ fontSize: 24 }}
          onClick={() => {
            navigate("/");
          }}
        >
          Open Banking
        </Typography>
        <Typography
          variant="h6"
          color="inherit"
          sx={{ fontSize: 18 }}
          onClick={() => {
            navigate("/about");
          }}
        >
          About Us
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
