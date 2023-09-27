import React, { useEffect } from 'react'
import styles from './videoPresentationComponent.module.css';

 function VideoPresentationComponent({teachervideo}) {

  return (
    <div className={styles.videoDiv}>

             <iframe
                className={styles.iframeVideo}
                src={`https://www.youtube-nocookie.com//embed/${teachervideo}?enablejsapi=1&origin=https://yourwebsite.com`}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen={true} // Use camelCase attribute name
                title="Teacher Video"
                muted // Mute the video
              ></iframe> 
    </div>
  )
}

export default VideoPresentationComponent