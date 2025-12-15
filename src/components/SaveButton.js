// src/components/SaveButton.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const SaveButton = ({ recipeId }) => {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && recipeId) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().savedRecipes?.includes(recipeId)) {
          setSaved(true);
        }
      }
    });
    return () => unsubscribe();
  }, [recipeId]);

  const toggleSave = async (e) => {
    e.preventDefault(); // Prevents the card click from opening the recipe page
    if (!user) return alert("Please sign in to save recipes!");

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { email: user.email }, { merge: true });

    if (saved) {
      await updateDoc(userRef, { savedRecipes: arrayRemove(recipeId) });
      setSaved(false);
    } else {
      await updateDoc(userRef, { savedRecipes: arrayUnion(recipeId) });
      setSaved(true);
    }
  };

  return (
    <button 
      onClick={toggleSave} 
      className={`absolute top-2 left-2 p-2 rounded-full shadow-md transition-colors duration-200 z-10 ${saved ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
};

export default SaveButton;