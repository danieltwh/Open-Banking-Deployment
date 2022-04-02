import { useEffect, useState } from "react";
import { csv } from "d3";
import data from "../newsapiorg_labelling.csv";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

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
  const [title, setTitle] = useState([]);
  const [label, setLabel] = useState([]);
  const [url, setUrl] = useState([]);

  useEffect(() => {
    csv(data).then((data) => {
      const title = [];
      const url = [];
      const label = [];
      data.forEach((e) => {
        title.push(e.publishedAt);
        url.push(e.content);
        label.push(e.include == "" ? "0" : e.include);
      });
      setTitle(title);
      setLabel(label);
      setUrl(url);
    });
  }, []);

  return (
    // <div style={{ height: 250, width: "80%" }}>
      
      <TableContainer sx={{margin:'auto', width:"80%"}} component={Paper}>
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
                <StyledTableCell><Link href={url[index]}>{t}</Link></StyledTableCell>
                <StyledTableCell>{label[index] == "-1" ? <ArrowDropDownIcon color="error"/> : <ArrowDropUpIcon color="success"/>} </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    // </div>
  );
}
