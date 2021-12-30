import { initializeApp, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { DEVELOPMENT_MODE } from './Constants';

const firebaseConfig = {
    apiKey: 'AIzaSyDb5UKC419V3i6oJEiOEKdl2Ix5Kl5JZIU',
    authDomain: 'for-tomorrow-8f2db.firebaseapp.com',
    projectId: 'for-tomorrow-8f2db',
    storageBucket: 'for-tomorrow-8f2db.appspot.com',
    messagingSenderId: '986458756084',
    appId: '1:986458756084:web:51ed8dfd1c5acb56fb9fa1',
    measurementId: 'G-0MTFCZBVHV',
};

// eslint-disable-next-line no-console
console.log(`You are running in ${process.env.NODE_ENV} mode.`);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth();
const db = getFirestore();
const functions = getFunctions(getApp());

if (process.env.NODE_ENV === DEVELOPMENT_MODE) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
}

// track watchers to allow for unsubbing
const watchMap = {};

// const snapshotToArray = (snapshot) => {
//     const returnArr = [];
//     snapshot.forEach((childSnapshot) => {
//         const item = childSnapshot.data();
//         item.id = childSnapshot.id;
//         returnArr.push(item);
//     });
//     return returnArr;
// };

export const onAuthStateChanged = (callback) => {
    auth.onAuthStateChanged(callback);
};

export const loginWithEmail = async (email, password) => {
    let res;
    try {
        res = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        console.error(e);
    }
    return res;
};

export const logoutOfFirebase = () => {
    Object.keys(watchMap).forEach((docId) => {
        watchMap[docId]();
    });
    auth.signOut();
};
window.logout = logoutOfFirebase;

export const getCurrentUser = () => auth.currentUser;

export const getCurrentUserData = async () => {
    return await db.collection('userData').doc(auth.currentUser.uid).get();
};

// export const watchDoc = async (collection, docId, onSnapShot, onError) => {
//     const doc = db.collection(collection).doc(docId);
//     if (watchMap[`${collection}-${docId}`]) {
//         console.log(`Unsubbing from doc: ${collection}/${docId}`);
//         watchMap[`${collection}-${docId}`]();
//     }
//     const unsub = doc.onSnapshot((docUpdate) => {
//         if (docUpdate.data()) {
//             onSnapShot({ id: docUpdate.id, ...docUpdate.data() });
//         } else {
//             onSnapShot();
//         }
//     }, onError);
//     watchMap[`${collection}-${docId}`] = unsub;
// };
