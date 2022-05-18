import { Grid } from "@mui/material";
import News from "../components/News";
import TestChart from "../components/chart";

function MainPage() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TestChart />
      </Grid>
      <Grid item xs={12}>
        <News />
      </Grid>
    </Grid>
  );
}

export default MainPage;
