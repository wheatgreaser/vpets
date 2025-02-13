import React, { useState } from "react";
import styles from "./Signup.module.css";
// Import Firebase functions correctly
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { getAnalytics } from "firebase/analytics";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrAn_i9d-LUREYePaDEL8kaI2TItaYevo",
  authDomain: "pokemans-4b2f1.firebaseapp.com",
  projectId: "pokemans-4b2f1",
  storageBucket: "pokemans-4b2f1.firebasestorage.app",
  messagingSenderId: "154321828881",
  appId: "1:154321828881:web:ba023bd57b7b2c61f8c5b0",
  measurementId: "G-QV1TWZ137G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

function Signup() {
  
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, password, name } = formData;
      
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: name,
        email: email,
        health: 100,
        foodQuantity: 10,
        coins: 500,
        friendList: [],
        xp: 10,
        level: 1,
        items: [],
        
      });

      alert("Sign-up successful!");
      navigate("/");

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className={styles.signupWrapper}> {/* Centering wrapper */}
      <div className={styles.signupContainer}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
