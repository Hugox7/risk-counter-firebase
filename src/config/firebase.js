import firebase from "firebase/app";
require("firebase/auth");
require("firebase/firestore");

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
  };
 
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// sign in with google
const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
   auth.signInWithPopup(provider);
}

// generate user document in firestore after user creation and update displayName
export const generateUserDocument = async (user, displayName) => {
    if (!user) return;
    const users = firestore.collection('users');
    
    try {
        await users.doc(user.user.user.uid).set({
            username: displayName,
            email: user.user.user.email,
            id: user.user.user.uid
        })
    } catch (error) {
        console.log('Error creating the document : ', error);
        }
    
    await updateDisplayName(displayName);
    
}

// get user document for react context
export const getUserDocument = async (uid) => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data(),
        }
    } catch (error) {

    }
}

const updateDisplayName = async (displayName) => {
    const user = auth.currentUser;
    await user.updateProfile({
        displayName,
    });
}

//get user games
export const getUserGames = async (uid) => {
    const userGames = await firestore.collection('users').doc(uid).collection('games').get();
    if (!userGames) return [];
    let games = [];
    userGames.forEach(game => games.push(game.data()));
    return games;
 }

 //get all users
 export const getUsers = async () => {
     const dbUsers = await firestore.collection('users').get();
     if (!dbUsers) return [];
     let users = [];
     dbUsers.forEach(user => users.push(user.data()));
     return users;

 }


