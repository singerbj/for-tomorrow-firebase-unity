import { initializeApp, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { DEVELOPMENT_MODE } from './Constants';

const { INITIAL_INVENTORY } = require('./shared/GridConstants');

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

export const loginOrSignupWithEmail = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        if (e.message.indexOf('auth/user-not-found') > -1) {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            const userDataRef = doc(db, 'userData', user.uid);
            return await setDoc(userDataRef, { inventory: INITIAL_INVENTORY }, { merge: false });
        }
        throw e;
    }
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

export const watchDoc = async (collection, docId, onSnapShot, onError) => {
    const unsub = onSnapshot(
        doc(db, collection, docId),
        (docUpdate) => {
            if (docUpdate.data()) {
                onSnapShot({ id: docUpdate.id, ...docUpdate.data() });
            } else {
                onSnapShot();
            }
        },
        (err) => {
            onError(err);
        }
    );
    watchMap[`${collection}-${docId}`] = unsub;
};

export const moveItem = async (newGridItemLocation, oldGridItemLocation, rotated) => {
    try {
        const func = httpsCallable(functions, 'moveItem');
        const uidToken = await getAuth().currentUser.getIdToken(true);
        const { error } = await func({ uidToken, newGridItemLocation, oldGridItemLocation, rotated });
        if (error) {
            throw new Error(error);
        }
    } catch (e) {
        throw new Error(e);
    }
};

export const deleteGridItem = async (gridItemUuid) => {
    try {
        const func = httpsCallable(functions, 'deleteItem');
        const uidToken = await getAuth().currentUser.getIdToken(true);
        const { error } = await func({ uidToken, gridItemUuid });
        if (error) {
            throw new Error(error);
        }
    } catch (e) {
        throw new Error(e);
    }
};
