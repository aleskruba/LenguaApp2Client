import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import axios from 'axios';
import BASE_URL from '../../config';
import styles from './toggleTeacher.module.css';


export default function NativeSelectDemo({state,setState}) {

  const [buttonState,setButtonState] = React.useState(false)
  const [successMessage,setSuccessMessage] = React.useState(false)

  React.useEffect(()=>{},[successMessage,buttonState])

  const handleStateChange = (event) => {
    const newState = event.target.value === 'true'; // Convert the string value to a boolean
    setButtonState(true);
    setState(newState);
  };

  const updateTeacherState = async () => {


    try {
      const url = `${BASE_URL}/teachertoggle`;
      const data = {
        state: state,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };

      const response = await axios.post(url, data, config);
      setSuccessMessage(true)
      setButtonState(false)
    //  console.log(response.data.message); // Assuming your backend sends a message upon successful update
      setTimeout(()=>{setSuccessMessage(false)},1000)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Teacher state
        </InputLabel>
        <NativeSelect
          value={state} // Set the selected value based on the state
          onChange={handleStateChange} // Update the state when the selection changes
          inputProps={{
            name: 'age',
            id: 'uncontrolled-native',
          }}
        >
        <option value={false} >No</option>
          <option value={true} >Yes</option>
        </NativeSelect>
      </FormControl>
      <button onClick={updateTeacherState} className={buttonState ? styles.btn : styles.btnNone}>Save</button> {/* Add a button to trigger the state update */}
      {successMessage  ? <h5> State changed succefuly</h5> : ''}
    </Box>
  );
}
