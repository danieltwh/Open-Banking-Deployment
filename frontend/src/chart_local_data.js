import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import data from "./EUR_USD_Labelled_v1.csv";
import { csv } from "d3";
import { Box } from "@mui/material";
import Button from '@mui/material/Button';

function LineChart() {
  const [pts, setPts] = useState([]);
  const [option, setOption] = useState(null);

  useEffect(() => {
    const x_axis = [];
    const label = [];
    const y_axis = [];
    const points = [['X', 'Y', {'type': 'string', 'role': 'style'}]];

    csv(data).then((data) => {
      var i = 0;
      data.forEach((e) => {
        x_axis.push(e.Date);
        y_axis.push(e.Price);
        label.push(e.label);
        points.push([e.Date, parseFloat(e.Price), e.label == 2 ? 'point { size: 4; shape-type: triangle; fill-color: green; }' 
                                                                : e.label == 1 
                                                                ? 'point { size: 4; shape-type: triangle; fill-color: red; shape-rotation: 180; }'
                                                                : null]);
      });
      setPts(points.slice(0, 265));
      
    });
  }, []);
const options = {
        title: "EUR_USD",
        hAxis: { title: "Date", viewWindow: { min: 0, max: 265 } },
        vAxis: { title: "FX rate", viewWindow: { min: 1.25, max: 1.40 } },
        legend: "none",
        lineWidth: 2,
        colors: ['black'],
        pointSize: 1,
        // pointShape: { type: "triangle" },
       
      };
      
  return (
    <Box>
    {/* <Button variant="outlined"> 
        Date Picker
    </Button> */}
      <Chart
        chartType="LineChart"
        data={pts}
        options={options}
        width="100%"
        height="600px"
        legendToggle
      />
    </Box>
  );
}

export default LineChart;
