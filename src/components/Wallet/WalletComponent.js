import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';



const columns = [
  { id: 'time', label: 'time', minWidth: 100 },
  { id: 'event', label: 'event', minWidth: 100 },
  {
    id: 'amount',
    label: 'amount',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'status',
    label: 'status',
    minWidth: 100,
    align: 'right',
   }
];

function createData(time, event, amount, status) {
   return { time, event, amount, status };
}

const rows = [
  {id:1,time:'2023-06-15 16:35',event:'booking lesson',amount:50,status:'completed'}, 
  {id:2,time:'2023-06-15 16:35',event:'booking lesson',amount:50,status:'completed'},
  {id:3,time:'2023-06-15 16:35',event:'booking lesson',amount:50,status:'completed'},
  {id:4,time:'2023-06-15 16:35',event:'booking lesson',amount:50,status:'completed'} 

];

export default function ColumnGroupingTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '95%' }}>
      <TableContainer sx={{maxHeight: isMobile ? '300px' : '440px' }}>
<Table stickyHeader aria-label="sticky table">
<TableHead  >
<TableRow > 
<TableCell align="center" colSpan={2} style={{ background: 'whitesmoke', fontSize: '25px' }}>
    Peter Novak
</TableCell>

<TableCell align="center" colSpan={3} style={{ background: 'whitesmoke', fontSize: '25px' }}>
England
</TableCell>
</TableRow>
<TableRow>
{columns.map((column) => (
<TableCell
key={column.id}
align={column.align}
style={{ top: isMobile ? 41 : 57, minWidth: column.minWidth, fontWeight: '800' }}

>
{column.label}
</TableCell>
))}
</TableRow>
</TableHead>
<TableBody >
{rows
.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
.map((row) => {
return (
<TableRow hover role="checkbox" tabIndex={-1} key={row.id} >
{columns.map((column) => {
const value = row[column.id];
return (
<TableCell key={column.id} align={column.align}>
{column.format && typeof value === 'number'
? column.format(value)
: value}
</TableCell>
);
})}
</TableRow>
);
})}
</TableBody>
</Table>
</TableContainer>
<TablePagination
rowsPerPageOptions={[10, 25, 100]}
component="div"
count={rows.length}
rowsPerPage={rowsPerPage}
page={page}
onPageChange={handleChangePage}
onRowsPerPageChange={handleChangeRowsPerPage}
/>
</Paper>
);
}