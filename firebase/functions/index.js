const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { moveGridItem } = require('./GridManagement');

admin.initializeApp();

const db = admin.firestore();

// exports.authOnCreate = functions.auth.user().onCreate((userRecord) => {
//     const { email, uid } = userRecord;
//     return db.collection('userData').doc(uid).set({ email, inventory: INITIAL_INVENTORY });
// });

// Grid actions
// move item
exports.moveItem = functions.https.onCall(async (data) => {
    try {
        const { uid } = await admin.auth().verifyIdToken(data.uidToken);
        const userDataRef = db.collection('userData').doc(uid);
        await db.runTransaction(async (t) => {
            const doc = await t.get(userDataRef);

            const [error, newInventory] = moveGridItem(doc.data().inventory, data.newGridItemLocation, data.oldGridItemLocation, data.rotated);
            if (error) {
                throw new Error(error);
            }
            return t.update(userDataRef, { ...doc.data(), inventory: newInventory });
        });

        console.log('moveItem success!');
    } catch (e) {
        console.log('moveItem failed: ', e);
    }
});

// delete item
exports.deleteItem = functions.https.onCall(async (data) => {
    try {
        const { uid } = await admin.auth().verifyIdToken(data.uidToken);
        const userDataRef = db.collection('userData').doc(uid);
        await db.runTransaction(async (t) => {
            const doc = await t.get(userDataRef);

            const newInventory = { ...doc.data().inventory };
            delete newInventory[data.gridItemUuid];
            return t.update(userDataRef, { ...doc.data(), inventory: newInventory });
        });

        console.log('deleteItem success!');
    } catch (e) {
        console.log('deleteItem failed: ', e);
    }
});

// add item
// exports.addItem = functions.https.onCall((data, res) => {});
// transfer item
// exports.transferItem = functions.https.onCall((data, res) => {});
