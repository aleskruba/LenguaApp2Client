import React,{useState,useEffect} from 'react'
import styles from './withdraw.module.css';
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";


function Withdraw(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  const [credits,setCredits] = useState(0)
  
  const creditsToBuy = [50,100,150,200,250,300]

  useEffect(() => {
    fetch("http://localhost:5252/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));

   
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5252/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
     
    });
  }, []);


  useEffect(()=>{

  },[credits])

  return (
     <div className={styles.buyCreditMainDiv}>
      <h1 className={styles.title}>Please select the amount you wish to withdraw</h1>

      <h1 className={styles.titleAmount}>${credits}</h1>

     <div className={styles.creditsToBuyDIV}>  

      {creditsToBuy.map((element,index)=> ( 
       <div className={styles.creditBoxes} key={index} onClick={()=>{setCredits(element)}}>${element}</div>
      ))}

    </div>

    <div className={styles.taxText}>
    There is a $2 charge for every bank transaction.
    </div>

      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm  setCredits={setCredits} credits={credits}/>
        </Elements>
      )}
    </div>
    
  )
}

export default Withdraw