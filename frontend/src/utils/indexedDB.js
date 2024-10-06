const DB_NAME = 'EmpiricalGenericaDB';
const STORE_NAME = 'trialData';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "trialNumber" });
    };
  });
};

export const saveTrialData = (db, trialData) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(trialData);

    request.onerror = (event) => reject("Save error: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

export const getAllTrialData = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => reject("Read error: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};