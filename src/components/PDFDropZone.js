// frontend/src/components/PDFDropZone.js
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

const PDFDropZone = ({ onPDFProcessed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert the file to base64
      const base64Data = await fileToBase64(file);
      const base64String = base64Data.split(',')[1]; // Remove the data:application/pdf;base64, part
      
      // Send as JSON with base64 data
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdf_base64: base64String,
          input_text: "Please extract information from this PDF"
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to process PDF: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      onPDFProcessed(data);
    } catch (err) {
      setError(err.message);
      console.error('Error processing PDF:', err);
    } finally {
      setLoading(false);
    }
  }, [onPDFProcessed]);

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        mb: 3,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.400',
        borderRadius: 2,
        backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        width: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'rgba(25, 118, 210, 0.04)'
        }
      }}
    >
      <input {...getInputProps()} />
      
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6" color={isDragActive ? 'primary' : 'textSecondary'}>
            {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here, or click to select'}
          </Typography>
          
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default PDFDropZone;