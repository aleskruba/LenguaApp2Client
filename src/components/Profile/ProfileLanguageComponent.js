import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useAuth from '../../hooks/useAuth';
import BASE_URL from '../../config';
import axios from 'axios';

export default function LimitTags() {

  const { user } = useAuth();
  
  const [selectedLanguages, setSelectedLanguages] = useState(user.learnlanguages);


  const handleLanguageChange = (_, values) => {
    setSelectedLanguages(values.slice(0, 5)); // Limit selection to 5 languages
 
  };

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${BASE_URL}/updatelanguages`;

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        };

        // Check if selectedLanguages is not undefined or empty before making the request
        if (selectedLanguages && selectedLanguages.length > 0) {
          const response = await axios.post(url, { selectedLanguages }, config);
         // console.log(response.data); // Log the response data received from the backend
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [selectedLanguages]);


  const languages = [
    { language: 'english' },
    { language: 'german' },
    { language: 'spanish' },
    { language: 'french' },
    { language: 'italian' },
    { language: 'portuguese' },
    { language: 'russian' },
    { language: 'chinese' },
    { language: 'Japanese' },
    { language: 'korean' },
    { language: 'arabic' },
    { language: 'hindi' },
    { language: 'bengali' },
    { language: 'dutch' },
    { language: 'swedish' },
    { language: 'turkish' },
    { language: 'polish' },
    { language: 'greek' },
    { language: 'thai' },
  ];

  const isOptionEqualToValue = (option, value) => option.language === value.language;

  return (
    <Autocomplete
      multiple
      limitTags={5}
      options={languages}
      getOptionLabel={(option) => option.language}
      value={selectedLanguages}
      onChange={handleLanguageChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose up to 5 languages"
          variant="outlined"
        />
      )}
      isOptionEqualToValue={isOptionEqualToValue}
      sx={{ width: '400px' }}
    />
  );
}