import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, tokens: null });
  const [key, setKey] = useState(Date.now()); // Add a key to force re-render


  const updateUserContext = (userData, tokens) => {
    setAuth({ user: userData, tokens: tokens });
  };

  const updateProfilePicture = (profilePictureUrl) => {
    setAuth((prevAuth) => ({
      ...prevAuth,
      user: {
        ...prevAuth.user,
        profile: profilePictureUrl,
      },
    }));
    setKey(Date.now()); 
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${BASE_URL}/checkuser`;
        const response = await axios.get(url, { withCredentials: true });
        const responseData = response.data;

        if (responseData.user) {
          setAuth({
            user: responseData.user,
            tokens: {
              jwt: responseData.accessToken,
              refreshToken: responseData.refreshToken,
            },
          });
        } else {
          setAuth({ user: null, tokens: null });
        }
      } catch (err) {
        console.log('Error fetching user data:', err);
        setAuth({ user: null, tokens: null });
      } finally {
        // Set isLoading to false once the user data is fetched or failed to fetch
      }
    };

    fetchUserData();
  }, [key]);

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateUserContext,updateProfilePicture}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
