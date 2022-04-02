import "./App.css";
import LineChart from "./components/chart";
import { styled } from "@mui/material";
import AppAppBar from "./components/appBar";
import { Grid } from "@mui/material";
import News from "./components/News";
import TestChart from "./testChart";

const AppBarHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

function App() {
  return (
    <div className="App">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AppAppBar />
          <AppBarHeader />
        </Grid>
        <Grid item xs={12}>
          <TestChart />
        </Grid>
        <Grid item xs={12}>
          <News />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
