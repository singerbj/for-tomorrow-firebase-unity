const admin = require('firebase-admin');

console.log(process.env.FIREBASE_AUTH_EMULATOR_HOST);

// eslint-disable-next-line import/no-dynamic-require
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const { CATALOG } = require('../catalog/Catalog');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const updateCatalog = async () => {
    try {
        const colRef = db.collection('catalog');
        const batch = db.batch();
        Object.keys(CATALOG).forEach((id) => {
            const ref = colRef.doc(`${id}`);
            batch.set(ref, CATALOG[id]);
        });

        await batch.commit();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
};
updateCatalog();
