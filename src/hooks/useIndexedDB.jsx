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
        db.createObjectStore("Logs", { keyPath: "traceId" });
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
            console.log("Added", item);
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
