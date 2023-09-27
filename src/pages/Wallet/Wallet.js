import React from 'react'
import styles from './wallet.module.css';
import WalletComponent from '../../components/Wallet/WalletComponent'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


function Wallet() {

  const user = useAuth()

  const navigate = useNavigate();
  
  return (
    <div className={styles.walletMainDiv}>
      <div className={styles.walletTopDiv}>
    <div>    <h2 className={styles.walletTopDivH2}>My Wallet</h2></div>
    <div>    <h2 className={styles.walletTopDivH2}>${user.user.credits}</h2></div>
      </div>

      <div className={styles.walletMiddleDiv}>
         
      <div className={styles.walletMiddleDivButton} onClick={()=>navigate('/buycredit')}><h2 className={styles.walletMiddleDivBuy}>Buy credits</h2></div>   
      <div className={styles.walletMiddleDivButton} onClick={()=>navigate('/withdrawmoney')}><h2 className={styles.walletMiddleDivWithdraw}>Withdraw money</h2></div>   

      </div>

      <div className={styles.walletBottomDiv}></div>
    <WalletComponent/>
    
    </div>
  )
}

export default Wallet