import { Grid } from "@mui/material";
import News from "../components/News";

function AboutUs() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <News />
      </Grid>
    </Grid>
  );
}

export default AboutUs;
