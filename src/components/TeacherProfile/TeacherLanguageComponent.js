import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import BASE_URL from '../../config';
import axios from 'axios';

export default function LimitTags() {
 
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleLanguageChange = async (_, values) => {
    if ( selectedLanguages.length < 2 ) {
      setSelectedLanguages(values.slice(0, 5)); // Limit selection to 5 languages

    try {


     // if (values.length === 0) {console.log('empty')}
      const url = `${BASE_URL}/updateteachinglanguages`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      if (values) {
           await axios.post(url, { selectedLanguages: values }, config);
     
      }
    } catch (err) {
      console.log(err);
    }
  }else return;

  };


  const handleRemoveLanguage = async (language) => {
    const updatedLanguages = selectedLanguages.filter(lang => lang.language !== language);
    setSelectedLanguages(updatedLanguages);
    
    try {


    //  if (updatedLanguages.length === 0) {console.log('empty')}
      const url = `${BASE_URL}/updateteachinglanguages`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      if (updatedLanguages) {
           await axios.post(url, { selectedLanguages: updatedLanguages }, config);
     
      }
    } catch (err) {
      console.log(err);
    }



  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
         const url = `${BASE_URL}/updateteachinglanguages`;
         const config = {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        const response = await axios.get(url, config);
        setSelectedLanguages(response.data)
       } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const languages = [
    { language: 'english' },
    { language: 'german' },
    { language: 'spanish' },
    { language: 'french' },
    { language: 'italian' },
    { language: 'portuguese' },
    { language: 'russian' },
    { language: 'chinese' },
    { language: 'japanese' },
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
    { language: 'czech' },
    { language: 'slovak' }
  ];

  const isOptionEqualToValue = (option, value) => option.language === value.language;

  return (
    <Autocomplete
      multiple
      limitTags={2}
      options={languages}
      getOptionLabel={(option) => option.language}
      value={selectedLanguages}
      onChange={handleLanguageChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose up to 2 teaching languages"
          variant="outlined"
        />
      )}
      isOptionEqualToValue={isOptionEqualToValue}
      sx={{ width: '400px' }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.language}
            {...getTagProps({ index })}
            onDelete={() => handleRemoveLanguage(option.language)} // Add this line to handle removal
          />
        ))
      }
    />
    
      );
    }