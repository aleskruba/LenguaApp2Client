import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox({setSelectedLanguage,setCurrentPage}) {
  const handleLanguageChange = (event, value) => {
    setSelectedLanguage(value);
    if (value==null) { setCurrentPage(1);}
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={languages}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Language" />}
      onChange={handleLanguageChange}
    />
  );
}
const languages = [
    { label: 'english' },
    { label: 'german' },
    { label: 'french' },
    { label: 'spanish' },
    { label: 'czech' },
    { label: 'japanese' },
    { label: 'portuguese' },
    { label: 'italian' },
    { label: 'russian' },
    { label: 'chinese' },
    { label: 'korean' },
    { label: 'dutch' },
    { label: 'polish' },
    { label: 'swedish' },
    { label: 'danish' },
    { label: 'norwegian' },
    { label: 'finnish' },
    { label: 'turkish' },
    { label: 'greek' },
    { label: 'arabic' },
    { label: 'hindi' },
    { label: 'bengali' },
    { label: 'punjabi' },
    { label: 'urdu' },
    { label: 'persian' },
    { label: 'hebrew' },
    { label: 'thai' },
    { label: 'indonesian' },
    { label: 'malay' },
    { label: 'vietnamese' },
    { label: 'kurdish' },
    { label: 'swahili' },
    { label: 'rundi' },
    { label: 'amharic' },
    { label: 'hausa' },
    { label: 'igbo' },
    { label: 'yoruba' },
    { label: 'zulu' },
    { label: 'tagalog' },
    { label: 'kiswahili' },
    { label: 'tamil' },
    { label: 'telugu' },
    { label: 'marathi' },
    { label: 'gujarati' },
    { label: 'kannada' },
    { label: 'malayalam' },
    { label: 'icelandic' },
    { label: 'hungarian' },
    { label: 'romanian' },
    { label: 'slovak' },
    { label: 'bulgarian' },
    { label: 'ukrainian' }
  ];