const DB_NAME = 'NumberSwitchingTaskDB';
const STORE_NAME = 'trialData';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => {
      console.log("Database initialized successfully");
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "trialNumber" });
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
export const saveTrialData = async (db, trialData) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const serializedData = {
      ...trialData,
      responses: trialData.responses.map(response => {
        if (response.imageBlob instanceof Blob) {
          return {
            ...response,
            imageBlob: response.imageBlob
          };
        }
        return response;
      })
    };

    checkDataSize(serializedData);

    const request = store.put(serializedData);

    request.onerror = (event) => {
      console.error("Error saving trial data:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = () => {
      console.log("Trial data saved successfully, including image blobs");
      resolve();
    };

    transaction.oncomplete = () => {
      console.log("Transaction completed successfully");
    };

    transaction.onerror = (event) => {
      console.error("Transaction error:", event.target.error);
      reject(event.target.error);
    };
  });
};export const getAllTrialData = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
      console.error("Error retrieving trial data:", event.target.error);
      reject("Read error: " + event.target.error);
    };

    request.onsuccess = (event) => {
      const results = event.target.result;
      
      // Deserialize image blobs
      const deserializedResults = results.map(trial => ({
        ...trial,
        responses: trial.responses.map(response => {
          if (response.imageBlob) {
            // Convert ArrayBuffer back to Blob
            return {
              ...response,
              imageBlob: new Blob([response.imageBlob], { type: 'image/jpeg' })
            };
          }
          return response;
        })
      }));

      console.log('Retrieved and deserialized trial data:', deserializedResults);
      console.log('Number of trials with images:', deserializedResults.reduce((count, trial) => 
        count + trial.responses.filter(response => response.imageBlob).length, 0
      ));

      resolve(deserializedResults);
    };
  });
};// Add this function to the existing indexedDB.js file

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
