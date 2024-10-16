const DB_NAME = 'ExperimentDB';
const STORE_NAME = 'responses';
const DB_VERSION = 2;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('trialIndex', 'trialIndex', { unique: false });
    };
  });
};

const checkDataSize = (data) => {
  const size = new Blob([JSON.stringify(data)]).size;
  console.log(`Data size: ${size} bytes`);
  if (size > 50 * 1024 * 1024) { // Alert if size exceeds 50MB
    console.warn('Data size is approaching IndexedDB limits');
  }
  return size;
};

export const saveTrialData = async (db, responseData) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.add(responseData);

    request.onerror = (event) => {
      console.error("Error saving response data:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = () => {
      console.log("Response data saved successfully");
      resolve();
    };
  });
};

export const getAllTrialData = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
      console.error("Error retrieving trial data:", event.target.error);
      reject("Read error: " + event.target.error);
    };

    request.onsuccess = (event) => {
      const allResponses = event.target.result;
      const organizedData = allResponses.reduce((acc, response) => {
        if (!acc[response.trialIndex]) {
          acc[response.trialIndex] = [];
        }
        acc[response.trialIndex].push(response);
        return acc;
      }, {});
      resolve(organizedData);
    };
  });
};

export const clearDatabase = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = (event) => reject("Clear error: " + event.target.error);
    request.onsuccess = (event) => {
      console.log("Database cleared successfully");
      resolve(event.target.result);
    };
  });
};

export const saveTrialWithImage = async (trialId, imageBlob, trialData) => {
  const db = await openDB();
  const tx = db.transaction('trials', 'readwrite');
  const store = tx.objectStore('trials');
  await store.put({ id: trialId, imageBlob, ...trialData });
  await tx.done;
  console.log('Trial data and image saved successfully');
};