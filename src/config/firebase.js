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
        console.log(error);
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

 //get user from query search
 export const getUserQuery = async (query) => {
    let response = [];
    let snapshot = await firestore.collection('users').where('username', '==', query).get();
    if (snapshot.docs.length) {
        snapshot.docs.forEach(doc => {
            return response.push(doc.data());
        });
    }
    return response;
 }

 // send friend request to user
 export const sendFriendRequest = async (uid, content) => {   
        await firestore.collection('users')
            .doc(uid)
            .collection('notifications')
            .add(content)
   
 }

 //get user notifications
 export const getUserNotifications = async (uid) => {
     let notifications = await firestore.collection('users')
        .doc(uid)
        .collection('notifications')
        .get();
    if (!notifications) return [];
    let notifArray = [];
    notifications.forEach(notif => {
        return notifArray.push(notif.data());
    });
    return notifArray;
 }

 // get user friends
 export const getUserFriends = async (uid) => {
     let friends = await firestore.collection('users')
        .doc(uid)
        .collection('friends')
        .get();
    if (!friends) return [];
    let friendsArray = [];
    friends.forEach(friend => {
        return friendsArray.push(friend.data());
    })
    return friendsArray;
 }


