import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './layout.module.css'; 


function Layout() {
  return (
    <div className={styles.layoutContainer}> 
    <Header />
    <div className={styles.content}> 
      <Outlet />
    </div>
  </div>
  )
}

export default Layout