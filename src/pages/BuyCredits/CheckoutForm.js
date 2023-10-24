import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import styles from './buycredit.module.css';
import axios from 'axios';
import BASE_URL from "../../config";

export default function CheckoutForm({setCredits,credits}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  //const bankTax = 2



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const url = `${BASE_URL}/buycredits`;
      const data = {
        credits: credits,
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
  
       await axios.put(url, data, config);
      //const responseData = response.data;
   
  
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      setIsProcessing(true);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/completion`,
        },
      });
  
      if (error && (error.type === "card_error" || error.type === "validation_error")) {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
  
      setIsProcessing(false);
      setCredits(0);
    } catch (error) {
      console.error('Error confirming notification:', error);
      // Handle the error gracefully, possibly by displaying an error message to the user
    }
  };
  


  return (
    <div className={styles.main}>
    <form id="payment-form" onSubmit={handleSubmit}  className={styles.form}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit" className={styles.button}>
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
    </div>
  );
}