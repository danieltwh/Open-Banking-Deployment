import { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";
import { Chart } from "react-google-charts";
import data from "../EUR_USD_Labelled_v1.csv";
import { csv } from "d3";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

const URL = "https://openbanking-application.herokuapp.com/";
const SAMPLE_URL =
  "https://openbanking-application.herokuapp.com/fx?start=2015-10-10&end=2017-10-10";
function LineChart() {
  const [pts, setPts] = useState([]);
  const [option, setOption] = useState(null);

  useEffect(() => {
    axios.get(SAMPLE_URL)
    .then((res) => console.log(res))
    console.log("responss")
    var points = [
      [
        { type: "date", label: "Day" },
        "Average temperature",
        {'type': 'string', 'role': 'style'},
        
      ],   
    ];

    csv(data).then((data) => {
      data.forEach((e) => {
        // const date = parseISO(e.Date);
        points.push([parseISO('2014-12-12'), -0.5, 'point { size: 4; shape-type: triangle; fill-color: green; }'])
       
        // points.push([
        //   new Date(2016, 0, 0),
        //   parseFloat(e.Price),
        //   e.label == 2
        //     ? "point { size: 4; shape-type: triangle; fill-color: green; }"
        //     : e.label == 1
        //     ? "point { size: 4; shape-type: triangle; fill-color: red; shape-rotation: 180; }"
        //     : null,
        // ]);
      });
      setPts(points.slice(0, 265));
    });
  }, []);
  const options = {
    title: "EUR_USD",
    hAxis: {
      title: "Date",
      viewWindow: { min: 0, max: 265 },
      gridlines: { count: 30 },
    },
    vAxis: { title: "FX rate", viewWindow: { min: 1.25, max: 1.4 } },
    legend: "none",
    lineWidth: 2,
    colors: ["black"],
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
