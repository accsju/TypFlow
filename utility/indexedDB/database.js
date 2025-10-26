const database = {
    async openDB(dbName, storeName, version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true});
                    store.createIndex("timeLimit", "time", { unique: false});
                    store.createIndex("averageTypingSpeed", "averageTypingSpeed", { unique: false});
                    store.createIndex("charactersCount", "charactersCount", { unique: false});
                    store.createIndex("typoCount", "typoCount", { unique: false});
                    store.createIndex("wordsTypedCount", "wordsTypedCount", { unique: false});
                    store.createIndex("tag", "tag", { unique: false });
                    store.createIndex("timestamp", "timestamp", { unique: false});
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async addData(db, storeName, data) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getTopNData(db, storeName, n) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.openCursor(null, "prev");

            const results = [];
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && results.length < n) {
                    results.push(cursor.value); 
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        })
    },

    async getAllData(db, storeName) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async clearAllData(db, storeName) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        })
    },

    async deleteOldestData(db, storeName) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.openCursor(null, "next"); 

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const deleteRequest = cursor.delete();
                    deleteRequest.onsuccess = () => resolve(cursor.key);
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(request.error);
        });
    },

    async getRecordCount(db, storeName) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        })
    }
}
export default database;