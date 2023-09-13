import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)`
  color: black;

  .MuiSlider-thumb {
    width: 15px;
    height: 15px;
    border-radius: 0;
    background-color: black;
  }

  .MuiSlider-valueLabel{
    background-color: black;
    color: white;
  }
`;

function valuetext(value) {
  return `${value}`;
}

const minValue = 5;
const maxValue = 30;

export default function MinimumDistanceSlider({ sliderValue, setSliderValue, setCurrentPage }) {
  const handleChange1 = (event, newValue) => {
    if (newValue[1] - newValue[0] >= 3) {
      setSliderValue(newValue);
      setCurrentPage(1);
    }
  };

  return (
    <div
    style={{
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'center',
      width: '300px',
      height: '70px',
      backgroundColor: window.innerWidth <= 800 ? 'lightblue' : 'transparent',
    }}
  >
    <Box sx={{ width: 120 }}>
      <div style={{ textAlign: "center" }}>Hourly Tax</div>
      <StyledSlider
        getAriaLabel={() => 'Minimum distance'}
        value={sliderValue}
        onChange={handleChange1}
        valueLabelDisplay="on"
        getAriaValueText={valuetext}
        min={minValue}
        max={maxValue}
        step={1} // Set the step to 1
        disableSwap
      />
    </Box>
    </div>
  );
}
