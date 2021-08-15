import React, { useState, useEffect } from 'react';
import { firebaseAuth } from '../config/firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(null);

    function login(email, password) {
        return firebaseAuth.signInWithEmailAndPassword(email, password);
    }

    function signOut() {
        return firebaseAuth.signOut();
    }

    function logout() {
        return firebaseAuth.signOut()
    }

    function resetPassword(email) {
        return firebaseAuth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currUser.updatePassword(password)
    }

    function signUp(email, password) {
        return firebaseAuth.createUserWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        firebaseAuth.onAuthStateChanged((user) => {
            console.log("Inside auth state changed !!", user);
            setCurrUser(user);
        });
    }, []);

    let value = {
        currUser: currUser,
        signOut: signOut,
        login: login,
        logout: logout,
        signUp: signUp,
        resetPassword: resetPassword,
        updateEmail: updateEmail,
        updatePassword: updatePassword,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    );
}

