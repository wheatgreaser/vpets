import styles from './App.module.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import flowerguy from './flowerguy.png';

function App() {
  const [username, setUsername] = useState(""); 
  const [health, setHealth] = useState(50);
  const auth = getAuth(); 
  const db = getFirestore(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username); 
            setHealth(userDoc.data().health)
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
  }, [auth, db, health]); 
  useEffect(() => {
    console.log(health);
  }, [health]);

  useEffect(() => {
    if (!auth.currentUser) return; // Ensure user is logged in

    const interval = setInterval(async () => {
      setHealth((prevHealth) => {
        if (prevHealth > 0) {
          const newHealth = prevHealth - 1;

          // Update Firestore when health decreases
          updateDoc(doc(db, "users", auth.currentUser.uid), { health: newHealth })
            .catch((error) => console.error("Error updating health:", error));

          return newHealth;
        }
        return 0; // Stop at 0
      });
    }, 60000); // Runs every 60,000 ms (1 minute)

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [auth]);

  return (
    <div>
    <div className={styles.App}>
      <h1 className={styles.heading}>schizopets</h1>
      <div className={styles.topElements}>
        <Link to="/signup"><h2>signup</h2></Link>
        <Link to="/login"><h2>login</h2></Link>
        <Link to="/petstuff"><h2>petstuff</h2></Link>
      </div>
      
    </div>
    
    <div className={styles.secondHeading}>
        {username && <h2> welcome {username}</h2>} 
        
    </div>
    <div className={styles.pet1}>
      <img src={flowerguy} style={{ width: "640px", height: "300px" }}></img>
      
    </div>
    <div className = {styles.healthDisplay}>
    {health&& <h2>health: {health}</h2>} 
    </div>
    
    </div>
  );
}

export default App;
