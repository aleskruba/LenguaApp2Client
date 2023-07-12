import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function LimitTags() {
  const [selectedLanguages, setSelectedLanguages] = React.useState([]);

  const handleLanguageChange = (_, values) => {
    setSelectedLanguages(values.slice(0, 5)); // Limit selection to 5 languages
  };

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