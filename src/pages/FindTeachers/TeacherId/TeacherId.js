import { useParams } from 'react-router-dom';
import styles from './teacher.module.css';
import React from 'react'

function TeacherId() {
    const {teacherid} = useParams()

    return (
    <div className={styles.title}>TeacherId
  
    <h1>teacher{teacherid}</h1>

    </div>
    )
}

export default TeacherId