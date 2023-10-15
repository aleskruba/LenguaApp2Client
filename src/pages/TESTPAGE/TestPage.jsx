import React, { useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
import styles from './testpage.module.css';

function TestPage() {
  async function deleteLessons() {
    const url = `${BASE_URL}/deletelessons`;

    try {
      const response = await axios.delete(url, { withCredentials: true });
      console.log(response);
      // Handle success, update UI as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle error, show error message to the user if necessary
    }
  }

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={deleteLessons}>Delete Lessons</button>
    </div>
  );
}

export default TestPage;
