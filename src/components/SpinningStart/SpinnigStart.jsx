import React from 'react'
import styles from './spinningstart.module.css';
import CircularProgress, {
    circularProgressClasses,
  } from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function SpinnigStart() {
  return (
    <div className={styles.container}>
        <div className={styles.spinner}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress     sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#ff1a79' : '#e83058'),
     
             [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}/>
            </Box>
        </div>

        <div className={styles.oneMoment}>One moment...</div>
        <div className={styles.text}>Lengua is changing the way the world learns foreign languages.</div>
        

    </div>
  )
}

export default SpinnigStart