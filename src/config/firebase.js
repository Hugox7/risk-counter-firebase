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
const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
   auth.signInWithPopup(provider);
}
export const firestore = firebase.firestore();

//users 
export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = userRef.get();
    if (!snapshot.exists) {
        const { email, name } = user;
        try {
            await userRef.set({
                name,
                email,
                ...additionalData
              });
        } catch (error) {
            console.log('error creating user document ' + error);
        }
    }
    return getUserDocument(user.uid);
}

const getUserDocument = async (uid) =>  {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data()
          };
    } catch (error) {
        console.error("Error fetching user", error);
    }
}

