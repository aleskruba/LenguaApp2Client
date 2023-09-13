import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBoxTeacherType({ setSelectedTeacherType, setCurrentPage }) {
  const handleTeacherTypeChange = (event, value) => {
    setSelectedTeacherType(value);
    if (value === null) {
      setCurrentPage(1);
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={teacherType}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Teacher Type" />}
      onChange={handleTeacherTypeChange}
    />
  );
}
const teacherType = [
    { label: 'Teacher' },
    { label: 'Tutor' }
]