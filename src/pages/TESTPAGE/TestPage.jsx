import React, { Fragment, useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
import styles from './testpage.module.css';

function TestPage() {
  const [searchQuery, setSearchQuery] = useState('foo'); // Initial search query
  const [videoData, setVideoData] = useState([]);
  const [lessons,setlessons] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const firstNewElementRef = useRef(null); 

/*   useEffect(() => {
    // Function to fetch video data from the backend
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/search?search_query=${searchQuery}`, { withCredentials: true });
        console.log(response)
        setVideoData(response.data);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [searchQuery]);
 */
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const url = `${BASE_URL}/myteachers`;

      try {
        const response = await axios.get(url, { withCredentials: true });
        setlessons(response.data.allLessons);
        setIsLoading(false)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const handleNextElementsFunction = () => {
    setItemsPerPage(itemsPerPage + 15);
    setTimeout(()=>{
    if (firstNewElementRef.current) {
      firstNewElementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },100)
  }

console.log(firstNewElementRef.current)

  return (
    <div className={styles.container}>

{lessons?.slice(0, itemsPerPage).map((el,index)=> (

    <Fragment key={el._id}>
      {isLoading ? 
          
          <p>loading...</p> 
          :
          <div className={styles.box}  ref={index === itemsPerPage-18 ? firstNewElementRef : null}> 
                         <h3>{el._id}</h3>
                         <h3>{index}</h3>
              <h1>{el.teacherFirstName}  - {el.teacherLastName}</h1>
          </div>
         }
    </Fragment>
  )
)}
      {!isLoading && lessons?.length > 10 &&
<button onClick={handleNextElementsFunction}>next 5 elements</button>  }


{/*       <input
        type="text"
        placeholder="Search for videos"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div>
        {videoData.map((video, index) => (
            <div key={index}>
               {console.log(video.id.videoId)}
            <h2>{video.title}</h2>
            <img src={video.imageUrl} alt={video.title} />
          
      
              <iframe
         width="560"
         height="315"
     src={`https://www.youtube.com/embed/${video.id.videoId}?enablejsapi=1&origin=https://yourwebsite.com&key=AIzaSyAacVfBvuqLFggniw5_CgSfdq-M2g61_Lo`}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen={true} // Use camelCase attribute name
                title="Teacher Video"
                muted // Mute the video
              ></iframe>

          </div>
        ))}

<iframe width="930" height="523" src="https://www.youtube.com/embed/rtwAZnNukGY" title="Summer Music Mix 2023 🌊 Best Of Vocals Deep House 🌊 Coldplay, Justin Bieber, Alan Walker, Rihanna" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div> */}

      
    </div>
  );
}

export default TestPage;
