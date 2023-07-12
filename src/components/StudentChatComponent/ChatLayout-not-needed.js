import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

function Layout() {
    const [name,setName] = useState('')
    const [savedName,setSavedName] = useState(null)    

    const navigate = useNavigate();

    const handleChange = (e) => {
        setName(e.target.value)

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setSavedName(name);
        navigate('/chat', { state: { savedName: name } }); // Pass savedName as a separate prop
      };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <label>Enter Your name</label>
        <input type='text' value={name} onChange={handleChange}/>
        <input type='submit' value='login'/>
        </form>

    </div>
  )
}

export default Layout