import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import parse from "date-fns/parse";
import { subDays } from "date-fns";
import format from "date-fns/format";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import EURO from "../images/euro.jpg";
import USD from "../images/usd.jpg";
import { Box } from "@mui/system";

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
  const [start, setStart] = useState(format(lastMonth, "yyyy-MM-dd"));
  const end = format(today, "yyyy-MM-dd");

  useEffect(() => {
  
    axios
      .get(
        `${process.env.REACT_APP_URL}fx?start=${start}&end=${end}&token=${process.env.REACT_APP_TOKEN}`
      )
      .then((res) => res.data)
      .then((data) => {
        var points = [
          [
            { type: "date", label: "Day" },
            "FX rate",
            { type: "string", role: "style" },
          ],
        ];
        data.forEach((e) => {
          const str =
            e.label == 2
              ? "point { size: 4; shape-type: triangle; fill-color: green; }"
              : e.label == 1
              ? "point { size: 4; shape-type: triangle; fill-color: red; shape-rotation: 180; }"
              : "point { size: 0; }";
          points.push([
            parse(e.date, "EEEE, dd MMM yyyy' 00:00:00 GMT'", new Date()),
            parseFloat(e.price),
            str,
          ]);
        });
        setPts(points);
      });
  }, [start, end]);
  return (
    <div>
      <Box
        display="flex"
        sx={{
          marginLeft: "10%",
          marginRight: "15%",
          justifyContent: "space-between",
        }}
      >
        <AvatarGroup total={2}>
          <Avatar alt="Euro" src={EURO} />
          <Avatar alt="USD" src={USD} />
        </AvatarGroup>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button
            onClick={() => {
              setStart(format(lastMonth, "yyyy-MM-dd"));
            }}
          >
            1 Month
          </Button>
          <Button
            onClick={() => {
              setStart(format(lastThreeMonth, "yyyy-MM-dd"));
            }}
          >
            3 Months
          </Button>
          <Button
            onClick={() => {
              setStart(format(lastYear, "yyyy-MM-dd"));
            }}
          >
            1 Year
          </Button>
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

      {/* <Stack direction="row" spacing={1}>
        <Card
          sx={{
            marginLeft: "120px",
            width: "250px",
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
            <Typography variant="body2" color="text.secondary"></Typography>
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
            <Typography variant="body2" color="text.secondary"></Typography>
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
      </Stack> */}
    </div>
  );
}
