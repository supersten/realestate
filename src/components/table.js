import * as React from 'react';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PDFDropZone from './PDFDropZone';

// Define columns based on the fields from the backend
const extractedDataColumns = [
  { field: 'id', headerName: 'Document #', width: 100 },
  { field: 'Agent_Name', headerName: 'Agent Name', width: 150 },
  { field: 'Agent_Note', headerName: 'Agent Note', width: 200 },
  { field: 'Amount', headerName: 'Amount', width: 120, type: 'number' },
  { field: 'Amount_Note', headerName: 'Amount Note', width: 200 },
  { field: 'Earnest_Money_Amount', headerName: 'Earnest Money', width: 120, type: 'number' },
  { field: 'Earnest_Money_Note', headerName: 'Earnest Money Note', width: 200 },
  { field: 'Loan_Contingency_Amount', headerName: 'Loan Contingency', width: 150 },
  { field: 'Loan_Note', headerName: 'Loan Note', width: 200 },
  { field: 'Inspection_Required', headerName: 'Inspection Required', width: 150, type: 'boolean' },
  { field: 'Inspection_Note', headerName: 'Inspection Note', width: 200 },
  { field: 'Closing_Date', headerName: 'Closing Date', width: 150 },
  { field: 'Closing_Note', headerName: 'Closing Note', width: 200 },
  { field: 'Lease_Back_Required', headerName: 'Lease Back Required', width: 150 },
  { field: 'Lease_Back_Note', headerName: 'Lease Back Note', width: 200 },
  { field: 'Items_Included', headerName: 'Items Included', width: 200 },
  { field: 'Items_Included_Note', headerName: 'Items Included Note', width: 200 },
  { field: 'Other_Important_Notes', headerName: 'Other Notes', width: 200 },
];

// Sample data columns (original)
const sampleColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

// Sample data rows (original)
const sampleRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  const [extractedDataRows, setExtractedDataRows] = useState([]);
  const [documentCounter, setDocumentCounter] = useState(1);
  
  // Function to handle processed PDF data
  const handlePDFProcessed = (data) => {
    if (data.error) {
      console.error('Error from backend:', data.error);
      return;
    }
    
    // Add the new document data as a row
    const newRow = {
      id: documentCounter,
      ...data
    };
    
    setExtractedDataRows(prevRows => [...prevRows, newRow]);
    setDocumentCounter(prevCounter => prevCounter + 1);
  };

  // Determine which columns and rows to display
  const columns = extractedDataRows.length > 0 ? extractedDataColumns : sampleColumns;
  const rows = extractedDataRows.length > 0 ? extractedDataRows : sampleRows;

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <PDFDropZone onPDFProcessed={handlePDFProcessed} />
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ 
            pagination: { paginationModel },
            columns: {
              columnVisibilityModel: {}
            }
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={extractedDataRows.length === 0}
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}
