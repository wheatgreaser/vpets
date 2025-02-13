import styles from './Shop.module.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import cultmult from './cultmult.png';

function Shop() {
  const [username, setUsername] = useState(""); 
  const [health, setHealth] = useState(0);
  const [food, setFood] = useState(0);
  const [coins, setCoins] = useState(0);
  const [items, setItems] = useState([]);
  const auth = getAuth(); 
  const db = getFirestore(); 
  var [isAuthenticated, setAuthenticated] = useState(false);
  console.log(process.env.API_KEY)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      setAuthenticated(true);
      // User is logged in, update UI accordingly
    } else {
      console.log("User is signed out");
      // User is logged out, redirect or show login UI
    }
  });

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

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
    setCoins(coins - 15);
    updateDoc(doc(db, "users", auth.currentUser.uid), { foodQuantity: food + 1 })
            .catch((error) => console.error("Error updating foodQuantity:", error));
    setFood(food + 1);

    }
    else{
      alert('not enough money');
    }

    

  }

  const buyMult = () => {
    if (coins >= 300) {  // Ensure the user has at least 300 coins
      const newItems = [...items, "2mult"]; // Create a new array instead of using push()
      const newCoins = coins - 300;
  
      updateDoc(doc(db, "users", auth.currentUser.uid), { 
        coins: newCoins,
        items: newItems
      })
      .then(() => {
        setCoins(newCoins);  // Update local state after Firestore update
        setItems(newItems);
        alert("you bought a 2x cultivation multiplier!!")
      })
      .catch((error) => console.error("Error updating document:", error));
    } 
    else {
      alert('Not enough money');
    }
  };
  


  return (
    <div>
    <div className={styles.App}>
      <h1 className={styles.heading}>schizopets</h1>
      <div className={styles.topElements}>
        <Link to="/signup"><h2>signup</h2></Link>
        <Link to="/login"><h2>login</h2></Link>
        <a onClick={handleSignOut} className={styles.signOut}><h2>signout</h2></a>
        <Link to="/"><h2>home</h2></Link>
        

      </div>
      
    </div>

    {isAuthenticated && (
    <div>
        <h2 className={styles.title}>apothecary</h2>
        <div className = {styles.cultivationMultiplier}>
            <div class={styles.borderbox}>
            <h2>cultivation multiplier</h2>
            <img src={cultmult}></img>
            <button className={styles.coolbutton} onClick={buyMult}>300 coins</button>
            </div>
        </div>
    </div>
    )}
    {!isAuthenticated && (
      <div className={styles.BegToSign}><h2>signup/login to manage your pet</h2></div>
    )}
    </div>

  );
}

export default Shop;
