const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { INITIAL_INVENTORY } = require('../src/shared/GridConstants');
const { moveGridItem } = require('../src/shared/GridManagement');

admin.initializeApp();

const db = admin.firestore();

exports.authOnCreate = functions.auth.user().onCreate((userRecord) => {
    const { email, uid } = userRecord;
    return db.collection('userData').doc(uid).set({ email, inventory: INITIAL_INVENTORY });
});

// Grid actions
// move item
exports.moveItem = functions.https.onCall(async (data) => {
    try {
        const { uid } = await admin.auth().verifyIdToken(data.uidToken);
        const userDataRef = db.collection('userData').doc(uid);
        await db.runTransaction(async (t) => {
            const doc = await t.get(userDataRef);

            // const newPopulation = doc.data().population + 1;
            const [error, newInventory] = moveGridItem(doc.data().inventory, data.newGridItemLocation, data.oldGridItemLocation, data.rotated);
            if (error) {
                throw new Error(error);
            }
            return t.update(userDataRef, { ...doc.data(), inventory: newInventory });
        });

        console.log('Transaction success!');
    } catch (e) {
        console.log('Transaction failed: ', e);
    }

    // db.collection('userData').doc(uid).set({ inventory: INITIAL_INVENTORY });
    // // moveGridItem(gridState, newGridItemLocation, oldGridItemLocation, rotated);
    // // res.send({ data: 'Hello from Firebase!!!!' });
    // // });
    // return { world: 'hello' };
});
// delete item
exports.deleteItem = functions.https.onCall((data, res) => {});
// add item
exports.addItem = functions.https.onCall((data, res) => {});
// transfer item
exports.transferItem = functions.https.onCall((data, res) => {});
