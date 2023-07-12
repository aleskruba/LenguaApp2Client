import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    useEffect(() => {
       // setAuth(null);
          setAuth({})
    }, [setAuth]);

    navigate('/login')
    return null; // or any JSX you want to render while the redirect is happening
}

export default Logout;