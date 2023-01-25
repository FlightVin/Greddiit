import React from 'react';
import { Box, Typography } from '@mui/material';


export default function NotFound404() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: 'url(https://i.redd.it/c3uhsgo1vx541.jpg)'
      }}
    >
      <Typography variant="h1" style={{ color: 'white', marginTop: '200px' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        The page you’re looking for doesn’t exist.
      </Typography>
    </Box>
  );
}