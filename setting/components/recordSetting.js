import database from "/utility/indexedDB/database.js";
import { DB_CONFIG } from "/utility/indexedDB/dbConfig.js";

class RecordSetting extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this._render();
        this._init();
    }

    _render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                .record-setting {
                    padding: 10px;
                }
                h2 {
                    color: var(--primary-color);
                }
                #all-delete-btn {
                    color: white;
                    background: crimson;
                    border: none;
                    border-radius: 5px;
                    padding: 8px 16px;
                    transition: .3s;
                }
                #all-delete-btn:hover {
                    background: tomato;
                }
            </style>
            <div class="record-setting">
                <div>
                    <h2>記録の管理</h2>
                </div>
                <div>
                    <button type="button" id="all-delete-btn">記録をすべて削除する</button>
                </div>
            </div>
        `;
    }

    _init() {
        const root = this.shadowRoot;
        const allDeleteBtn = root.getElementById("all-delete-btn");
        allDeleteBtn.addEventListener("click", async () => {
            const dbName = DB_CONFIG.name; 
            const storeName = DB_CONFIG.stores.record;
            const db = await database.openDB(dbName, storeName);
            database.clearAllData(db, storeName);
        });
    }
}

customElements.define("record-setting", RecordSetting);