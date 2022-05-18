import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function News() {
  const [limit, setLimit] = useState(10);
  const [title, setTitle] = useState([]);
  const [label, setLabel] = useState([]);
  // const [url, setUrl] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}news?limit=${limit}&token=${process.env.REACT_APP_TOKEN}`)
      .then((res) => res.data)
      .then((data) => {
        const title = [];
        // const url = [];
        const label = [];
        data.forEach((e) => {
          title.push(e.title);
          label.push(e.sentiment);
        });
        setTitle(title);
        setLabel(label);
        // setUrl(url);
        // console.log(title);
        // console.log(label);
      });
  }, [limit]);

  return (
    <TableContainer sx={{ margin: "auto", width: "80%" }} component={Paper}>
      <Table sx={{ minWidth: 200 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>News</StyledTableCell>
            <StyledTableCell>Sentiment</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {title.map((t, index) => (
            <TableRow>
              <StyledTableCell>
                {/* <Link href={url[index]}>{t}</Link> */}
                {t}
              </StyledTableCell>
              <StyledTableCell>
                {label[index] == "-1" ? (
                  <ArrowDropDownIcon color="error" />
                ) : (
                  <ArrowDropUpIcon color="success" />
                )}{" "}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
