import React, { useEffect, useState } from 'react'

function TestPage() {

    
  const [file,setFile] = useState()
    
    function convertToBase64(file){
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
    
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
    
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }
  

    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64)
        console.log(base64)
      }


 

    return (
    <div>

        <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={file ? file : 'avatar.png'} alt="avatar"  style={{height:"100px"}}/>
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
          </div>

        
    </div>
  )
}

export default TestPage