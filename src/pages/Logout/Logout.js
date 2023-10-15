import { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

function Logout() {
  const navigate = useNavigate();
  const { setAuth,setUserDataFetched ,setMyStudentsNumber} = useContext(AuthContext);

  useEffect(() => {
    // Function to perform the logout API request
    const logoutUser = async () => {
      try {
        await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
        setUserDataFetched(false)
        setMyStudentsNumber(0)
        setAuth(null);
     
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    };

    // Call the logoutUser function to perform the logout
    logoutUser();
  }, [navigate, setAuth]);

  return null; // or any JSX you want to render while the redirect is happening
}

export default Logout;
