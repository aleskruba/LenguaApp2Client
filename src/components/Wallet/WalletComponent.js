import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button'; // Import the Button component
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import BASE_URL from "../../config";
import useAuth from '../../hooks/useAuth';
import moment from 'moment';


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

/* function createData(time, event, amount, status) {
  return { time, event, amount, status };
}
 */
export default function ColumnGroupingTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fetchedTransactions, setFetchedTransactions] = useState([]);
  const user = useAuth();

  const [rows, setRows] = useState([]);
  const [sortAscending, setSortAscending] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${BASE_URL}/gettransactions`;
        const response = await axios.get(url, { withCredentials: true });
        const responseData = response.data.transactions;
        setFetchedTransactions(responseData);

        // Map responseData to rows and update the state
        const newRows = responseData.map((element) => ({
          id: element._id,
          time: moment(element.date).format('YYYY-MM-DD HH:mm'), // Adjust the format as needed
          event: element.description,
          amount: element.amount,
          status: element.completed,
        }));

        newRows.sort((a, b) => {
          return b.time.localeCompare(a.time);
        });
  

        setRows(newRows);
      } catch (err) {
        console.log(err);
      } finally {
        // Set isLoading to false once the user data is fetched or failed to fetch
      }
    };

    fetchUserData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Function to toggle sorting order
// Function to toggle sorting order
const toggleSortOrder = () => {
  const newSortAscending = !sortAscending;
  setSortAscending(newSortAscending);

  // Sort the 'rows' array based on 'time' property in ascending or descending order
  const sortedRows = rows.slice().sort((a, b) => {
    const compareValue = sortAscending ? b.time.localeCompare(a.time) : a.time.localeCompare(b.time);
    return compareValue;
  });

  setRows(sortedRows);
};


  return (
    <Paper sx={{ width: '95%' }}>
      <TableContainer sx={{ maxHeight: isMobile ? '300px' : '440px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: isMobile ? 0:0, minWidth: column.minWidth, fontWeight: '800' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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

      {/* Button to toggle sorting order */}
      <Button variant="outlined" onClick={toggleSortOrder}>
        Toggle Sorting Order
      </Button>
    </Paper>
  );
}
