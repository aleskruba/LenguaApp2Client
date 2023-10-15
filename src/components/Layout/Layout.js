import React,{Fragment, useContext} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './layout.module.css'; 
import AuthContext from '../../context/AuthProvider';
import SpinnigStart from '../SpinningStart/SpinnigStart';
import useAuth from '../../hooks/useAuth';
import FirstPage from '../FirstPage/FirstPage';

function Layout() {

  const { user} = useAuth();
  const {userDataFetched,teachersAreLoading,notificationIsLoading,isLoading} = useContext(AuthContext);

  return (
   
    <> 

    {userDataFetched && !teachersAreLoading && !notificationIsLoading && !isLoading? 
                <div className={styles.layoutContainer}> 
                <Header />
                <div className={styles.content}> 
                  <Outlet />
                </div>
              </div>

              : !user ?  
                      !teachersAreLoading ?
                      <div className={styles.layoutContainer}> 
                      <Header />
                      <div className={styles.content}> 
                        <Outlet />
                      </div>
                    </div>

                      :

                     <FirstPage/>
              :
                    <SpinnigStart/>
              }
                   

                              



  </>

  )
}

export default Layout