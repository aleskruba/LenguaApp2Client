import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)`
  color: gray;

  .MuiSlider-thumb {
    width: 12px;
    height: 12px;
    border-radius: 0;
    background-color: gray;
  }
`;

function valuetext(value) {
  return `${value}°C`;
}

const minDistance = 2;
const minValue = 5;
const maxValue = 30;

export default function MinimumDistanceSlider({sliderValue,setSliderValue,setCurrentPage}) {
  const handleChange1 = (event, newValue) => {
    setSliderValue(newValue);
    if (newValue) setCurrentPage(1)
  };

  return (
    <Box sx={{ width: 150 }}>
      <div style={{ textAlign: "center" }}>Hourly Tax</div>
      <StyledSlider
        getAriaLabel={() => 'Minimum distance'}
        value={sliderValue}
        onChange={handleChange1}
        valueLabelDisplay="on" // Changed to "on"
        getAriaValueText={valuetext}
        min={minValue}
        max={maxValue}
        disableSwap
      />
    </Box>
  );
}