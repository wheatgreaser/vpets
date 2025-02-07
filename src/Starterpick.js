import styles from './Starterpick.module.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import flowerguy from './flowerguy.png';

function Starterpick() {
  const [username, setUsername] = useState(""); 

  const auth = getAuth(); 
  const db = getFirestore(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username); 
          } else {
            console.log("No such user in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        setUsername(""); 
      }
    });

    return () => unsubscribe(); 
  }, [auth, db]); 

  return (
    <div>
    <div className={styles.App}>
      <h1 className={styles.heading}>schizopets</h1>
      <div className={styles.topElements}>
        <Link to="/petstuff"><h2>petstuff</h2></Link>
      </div>
      
    </div>
    <div className={styles.secondHeading}>
        <h1>pick a starter</h1>
        
      </div>
      <div className={styles.pet1}>
      <img src={flowerguy} style={{ width: "640px", height: "300px" }}></img>
      </div>
    
    </div>
  );
}

export default Starterpick;
