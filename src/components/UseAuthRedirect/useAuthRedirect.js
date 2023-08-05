import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';

const useAuthRedirect = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Redirect to the home page if the user is logged in and tries to access the login page
    if (auth.user && location.pathname === '/login') {
      return <Navigate to="/" />;
    }
  }, [auth.user, location.pathname]);

  return null;
};

export default useAuthRedirect;