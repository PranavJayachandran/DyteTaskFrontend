let version = 1;
export const initDB = () => {
  let newDB = false;
  return new Promise((resolve) => {
    // open the connection
    let request = indexedDB.open("LogsDB");

    request.onupgradeneeded = () => {
      let db = request.result;
      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains("Logs")) {
        console.log("Creating users store");
        let store = db.createObjectStore("Logs", { keyPath: "traceId" });
        store.createIndex("levelIndex", "level", { unique: false });
        store.createIndex("messageIndex", "message", { unique: false });
        store.createIndex("resourceIdIndex", "resourceId", { unique: false });
        store.createIndex("timestampIndex", "timestamp", { unique: false });
        store.createIndex("traceIdIndex", "traceId", { unique: false });
        store.createIndex("spanIdIndex", "spanId", { unique: false });
        store.createIndex("commitIndex", "commit", { unique: false });
        store.createIndex("parentResourceIdIndex", "parentResourceId", {
          unique: false,
        });
        newDB = true;
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      let db = request.result;
      version = db.version;
      console.log("request.onsuccess - initDB", version);
      resolve({ created: true, newDb: newDB });
    };

    request.onerror = () => {
      resolve({ created: false, newDb: newDB });
    };
  });
};

export const addData = (storeName, data) => {
  return new Promise((resolve) => {
    let request = indexedDB.open("LogsDB", version);

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data);
      let db = request.result;

      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const promises = data.map((item) => {
        return new Promise((itemResolve) => {
          const addRequest = store.add(item);
          addRequest.onsuccess = () => {
            itemResolve(item);
          };

          addRequest.onerror = () => {
            const error = addRequest.error?.message;
            console.log(error);
            if (error) {
              itemResolve(error);
            } else {
              itemResolve("Unknown error");
            }
          };
        });
      });

      Promise.all(promises)
        .then((result) => {
          console.log("Done");
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
          resolve(error);
        });
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

export const getData = (storeName) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("LogsDB", version);

    request.onsuccess = () => {
      console.log("request.onsuccess - getData");
      const db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const data = getAllRequest.result;
        resolve(data);
      };

      getAllRequest.onerror = () => {
        const error = getAllRequest.error?.message;
        if (error) {
          resolve(error);
        } else {
          resolve("Unknown error");
        }
      };
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};
export const queryLogsByIndex = (indexQueries) => {
  console.log(indexQueries);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("LogsDB", version);

    request.onsuccess = () => {
      console.log("request.onsuccess - getData", indexQueries);
      const db = request.result;
      let transaction = db.transaction("Logs", "readonly");
      let store = transaction.objectStore("Logs");

      // Create promises for each index query dynamically
      const promises = indexQueries.map(({ indexName, value }) => {
        return new Promise((resolveIndex, rejectIndex) => {
          let index = store.index(indexName);
          let logs = [];
          let range = IDBKeyRange.only(value);

          const request = index.openCursor(range);

          request.onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
              logs.push(cursor.value);
              cursor.continue();
            } else {
              resolveIndex(logs);
            }
          };

          request.onerror = () => {
            rejectIndex(`Error querying logs by ${indexName}`);
          };
        });
      });

      // Use Promise.all to wait for all index queries to complete
      Promise.all(promises)
        .then((results) => {
          // Combine or filter results as needed based on your logic
          const combinedResults = combineResults(results, indexQueries);
          resolve(combinedResults);
        })
        .catch((error) => {
          reject(error);
        });
    };

    request.onerror = () => {
      reject("Error opening database");
    };
  });
};
const combineResults = (results, indexQueries) => {
  // Use concat to merge arrays into a single flat array
  let tempResult = [].concat(...results);
  console.log(tempResult);
  const traceIds = new Set();
  tempResult = tempResult.filter((obj) => {
    if (!traceIds.has(obj.traceId)) {
      traceIds.add(obj.traceId);
      return true;
    }

    return false;
  });
  console.log(tempResult, traceIds);
  tempResult = tempResult.filter((result) => {
    let take = true;
    indexQueries.map(({ indexName, value }) => {
      if (indexName === "levelIndex") {
        if (result.level != value) take = false;
      }
      if (indexName == "messageIndex") {
        if (result.message != value) take = false;
      }
      if (indexName == "resourceIdIndex") {
        if (result.resourceId != value) take = false;
      }
      if (indexName == "timeStampIndex") {
        if (result.timeStamp != value) take = false;
      }
      if (indexName == "traceIdIndex") {
        if (result.traceId != value) take = false;
      }
      if (indexName == "spanIdIndex") {
        if (result.spanId != value) take = false;
      }
      if (indexName == "commitIndex") {
        if (result.commit != value) take = false;
      }
      if (indexName == "parentResourceIdIndex") {
        if (result.parentResourceId != value) take = false;
      }
    });

    if (take) return result;
  });
  return tempResult;
};
