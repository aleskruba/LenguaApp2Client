import React, { useEffect, useState } from 'react';
import styles from './adminusers.module.css';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import BASE_URL from '../../../config';



function AdminUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState('email'); // Default search field
  const [isLoading,setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${BASE_URL}/getusers`;
        const response = await axios.get(url, { withCredentials: true });
        setAllUsers(response.data.users);
        setIsLoading(false)
        } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchFieldChange = (field) => {
    setSearchField(field);
  };

  const filteredUsers = allUsers.filter((user) => {
    if (query === '') {
      return true; // No query, show all users
    }
    
    if (searchField === 'email' && user.email.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
    
    if (searchField === 'lastName' && user.lastName.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }
  
//mongo
    if (user._id) {
          if (searchField === 'id' && (user._id).toString().includes(query.toLowerCase())) {
            return true;
          }
        } 

    return false;
  });

  const initialUsersToShow = filteredUsers.slice(0, 50); // Display the first 5 users initially


  return (
    <div className={styles.container}>
      {!isLoading ? <> 
      <div className={styles.top}>
        <h1 className={styles.topTitle}>Users</h1>
      </div>
      <div className={styles.searchBar}>
        <div className={styles.searchField}>
          <div>Search by:</div>
          <select value={searchField} onChange={(e) => handleSearchFieldChange(e.target.value)}>
            <option value="email">Email</option>
            <option value="lastName">Last Name</option>
            <option value="id">ID</option>
          </select>
        </div>

        <div className={styles.searchField}>
          <div>Search</div>
          <input
            value={query}
            type="search"
            onChange={handleChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.results}>
      {initialUsersToShow.map((user) => (
          <Link to={`${user._id ? user._id : user.id}`} 
                key={user._id ? user._id : user.id}
                state={{userFromLink:user}}
                > 
          <div className={styles.filteredResults} >
            <div className={styles.searchField1}>{user.email}</div>
            <div className={styles.searchField2}>{user.lastName}</div>
            <div className={styles.searchField3}>{user._id}</div>
          </div>
        </Link>           
        ))}
        {filteredUsers && filteredUsers.length > 2 && (
          <div className={styles.filteredResults}>
            <div className={styles.searchField1}></div>
            <div className={styles.searchField2}> 
                <span className={styles.nextUsers}>... next {allUsers.length-5} { allUsers.length-5 > 1 ? 'users':'user'} </span></div>
            <div className={styles.searchField3}></div>
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className={styles.filteredResults}>
            <div className={styles.noResults}>No matching users found.</div>
          </div>
        )}
      </div>
      </> : <p>wait a second ...</p>}
    
    <button onClick={()=>{navigate('../admin')}} className={styles.backBtn}>Back</button>
    </div>
  );
}

export default AdminUsers;