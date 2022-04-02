import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import getDay from 'date-fns/getDay'
import parse from 'date-fns/parse';
import {subDays} from "date-fns"
import format from 'date-fns/format'
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EURO from "./euro.jpg";
import USD from "./usd.jpg";
import SGD from "./sgd.jpg";
import { Box } from "@mui/system";
const URL = "https://openbanking-application.herokuapp.com/";

export const options = {
  title: "EURO/USD exchange rate",
  height: 500,
  pointSize: 1,
  colors: ["black"],
  legend: "none",
  axes: {
    y: {
      Temps: { label: "Temps (Celsius)" },
    },
  },
};

export default function TestChart() {
  const [pts, setPts] = useState([]);
  const today = new Date();
  const lastMonth = subDays(today, 30);
  const lastThreeMonth = subDays(today, 90);
  const lastYear = subDays(today, 365);
  const [start, setStart] = useState(format(lastMonth, 'yyyy-MM-dd'));
  const end = format(today, 'yyyy-MM-dd');

  useEffect(() => {
    axios.get(`${URL}fx?start=${start}&end=${end}`)
    .then((res) => res.data)
    .then(data => {
    var points = [
      [
        { type: "date", label: "Day" },
        "FX rate",
        { type: "string", role: "style" },
      ],
    ];
    console.log(`${URL}fx?start=${start}&end=${end}`)

      data.forEach((e) => {
        //console.log(parse(e.date, "EEEE, dd MMM yyyy' 00:00:00 GMT'", new Date()) )
        //console.log(e.date)
        //console.log(e.price)
        const str =
          e.label == 2
            ? "point { size: 4; shape-type: triangle; fill-color: green; }"
            : e.label == 1
            ? "point { size: 4; shape-type: triangle; fill-color: red; shape-rotation: 180; }"
            : "point { size: 0; }";
        points.push([parse(e.date, "EEEE, dd MMM yyyy' 00:00:00 GMT'", new Date()), parseFloat(e.price), str]);
      });
    setPts(points); })
  }, [start]);
  return (
    <div>
        <Box justifyContent="flex-end" display="flex" sx={{marginRight:"100px"}}
      >
          <ButtonGroup variant="outlined" aria-label="outlined primary button group">
        <Button onClick={() => {setStart(format(lastMonth, 'yyyy-MM-dd')); console.log(lastMonth)}}>1 Month</Button>
        <Button onClick={() => {setStart(format(lastThreeMonth, 'yyyy-MM-dd')); console.log(lastThreeMonth)}}>3 Months</Button>
        <Button onClick={() => {setStart(format(lastYear, 'yyyy-MM-dd')); console.log(lastYear)}}>1 Year</Button>
        <Button> 3 Years</Button>
        </ButtonGroup>
      </Box>
      <Chart
        chartType="LineChart"
        width="100%"
        height="500px"
        data={pts}
        options={options}
      />
    
      <Stack direction="row" spacing={1}>
        <Card
          sx={{
            marginLeft: "120px",
            width: "250px",
            backgroundColor: "#9be4fa",
          }}
        >
          <CardHeader
            avatar={
              <AvatarGroup total={2}>
                <Avatar alt="Euro" src={EURO} />
                <Avatar alt="USD" src={USD} />
              </AvatarGroup>
            }
            title="EUROUSD"
            subheader="Euro / U.S. Dollar"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Placeholder
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: "250px" }}>
          <CardHeader
            avatar={
              <AvatarGroup total={2}>
                <Avatar alt="USD" src={USD} />
                <Avatar alt="SGD" src={SGD} />
              </AvatarGroup>
            }
            title="USDSGD"
            subheader=" U.S. Dollar / Singapore Dollar"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: "250px" }}>
          <CardHeader
            avatar={
              <AvatarGroup total={2}>
                <Avatar alt="Euro" src={EURO} />
                <Avatar alt="SGD" src={SGD} />
              </AvatarGroup>
            }
            title="EUROSGD"
            subheader="Euro / Singapore Dollar"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ width: "250px" }}>
          <CardHeader
            avatar={
              <AvatarGroup total={2}>
                <Avatar alt="Usd" src={USD} />
                <Avatar alt="Euro" src={EURO} />              
              </AvatarGroup>
            }
            title="USDEURO"
            subheader=" U.S. Dollar / Euro"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Placeholder
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
