import styles from './App.module.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import flowerguy from './flowerguy.png';

function App() {
  const [username, setUsername] = useState(""); 
  const [health, setHealth] = useState(50);
  const [food, setFood] = useState(2);
  const [coins, setCoins] = useState(1);
  const auth = getAuth(); 
  const db = getFirestore(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username); 
            setHealth(userDoc.data().health);
            setFood(userDoc.data().foodQuantity);
            setCoins(userDoc.data().coins);
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

  const cultivation = () => {
    if (food === 0) {
      alert("No food left to cultivate!");
      return;
    }
  
    // Decrease food immediately
    updateDoc(doc(db, "users", auth.currentUser.uid), { foodQuantity: food - 1 })
      .catch((error) => console.error("Error updating foodQuantity:", error));
    setFood(food - 1);
  
    // Increase food after 5 minutes (300,000 ms)
    setTimeout(() => {
      updateDoc(doc(db, "users", auth.currentUser.uid), { foodQuantity: food + 2 })
        .catch((error) => console.error("Error updating foodQuantity after cultivation:", error));
      setFood((prevFood) => prevFood + 2);
    }, 300000);
  };

  const increaseHealth = () => {
    if(food == 0){
      alert("no food left");
      return 0;
    }
    updateDoc(doc(db, "users", auth.currentUser.uid), { health: health + 10 })
            .catch((error) => console.error("Error updating health:", error));
    setHealth(health + 10);
    updateDoc(doc(db, "users", auth.currentUser.uid), { foodQuantity: food - 1 })
            .catch((error) => console.error("Error updating foodQuantity:", error));
    setFood(food - 1);

  }

  const sellFood = () => {
    if(food == 0){
      alert("no food left");
      return 0;
    }
    if(food > 0){
      updateDoc(doc(db, "users", auth.currentUser.uid), { coins: coins + 10 })
            .catch((error) => console.error("Error updating health:", error));
    setCoins(coins + 10);
    updateDoc(doc(db, "users", auth.currentUser.uid), { foodQuantity: food - 1 })
            .catch((error) => console.error("Error updating foodQuantity:", error));
    setFood(food - 1);

    }
    else{
      alert("not enough food");
    }
    

  }

  const buyFood = () => {

    if(coins > 15){
      updateDoc(doc(db, "users", auth.currentUser.uid), { coins: coins - 15 })
            .catch((error) => console.error("Error updating health:", error));
    setCoins(coins + 10);
    updateDoc(doc(db, "users", auth.currentUser.uid), { foodQuantity: food + 1 })
            .catch((error) => console.error("Error updating foodQuantity:", error));
    setFood(food - 1);

    }
    else{
      alert('not enough money');
    }

    

  }

  return (
    <div>
    <div className={styles.App}>
      <h1 className={styles.heading}>schizopets</h1>
      <div className={styles.topElements}>
        <Link to="/signup"><h2>signup</h2></Link>
        <Link to="/login"><h2>login</h2></Link>
        
      </div>
      
    </div>
    
    <div className={styles.secondHeading}>
        {username && <h2> welcom e {username}</h2>} 
        
    </div>
    <div className={styles.pet1}>
      <img src={flowerguy} style={{ width: "640px", height: "300px" }}></img>
      
    </div>
    <div className = {styles.healthDisplay}>
    {health&& <h2>health: {health}</h2>} 
    </div>
    <div className = {styles.healthDisplay}>
    {coins&& <h2>coins: {coins}</h2>} 
    </div>
    <div className = {styles.healthDisplay}>
    {food&& <h2>food quantity: {food}</h2>} 
    <button className={styles.coolbutton} onClick={increaseHealth}>feed the monster</button>
    <button className={styles.coolbutton} onClick={sellFood}>sell food</button>
    <button className={styles.coolbutton} onClick={cultivation}>cultivate food</button>
    <button className={styles.coolbutton} onClick={buyFood}>buy food</button>
    </div>

    </div>
  );
}

export default App;
