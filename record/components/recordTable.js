import database from "/TypFlow/utility/indexedDB/database.js";
import { DB_CONFIG } from "/TypFlow/utility/indexedDB/dbConfig.js";

class RecordTable extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this._render()
        this._init();
    }

    _render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                .log-table-container {
                    max-height: 300px; 
                    overflow-y: auto;
                    display: grid;
                    place-items: center;
                }
                .log-table-container > * {
                    color: var(--primary-color);
                }
                .title {
                    text-align: left;
                    background: linear-gradient(90deg,rgba(240, 34, 103, 1) 0%, rgba(252, 176, 69, 1) 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    display: grid;
                    place-items: center;
                    padding: 5px 10px;
                    margin: 30px 0 10px 0;
                    border-radius: 5px;
                    font-weight: bold;
                }
                table {
                    border: 1px solid var(--primary-background-color2);
                    border-radius: 5px;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid var(--primary-background-color2);
                    padding: 5px;
                    width: 90px;
                    font-size: .7rem;
                    text-align: center; 
                }
                .tag {
                    padding: 2px 6px;
                    border-radius: 10px;
                    margin: 3px;  
                }
                .html {
                    background: orange;
                }
                .css {
                    background: #61c2f7ff;
                }
                .javascript {
                    background: yellow;
                }
            </style>
            <div class="log-table-container">
                <div class="title">タイピング記録</div>
                <table>
                    <thead>
                        <tr>
                            <th>制限時間</th>
                            <th>平均打鍵速度(秒)</th>
                            <th>打鍵数</th>
                            <th>タイポ</th>
                            <th>打鍵単語数</th>
                            <th>タグ</th>
                            <th>タイムスタンプ</th>
                        </tr>
                    </thead>
                    <tbody id="record-container">
                    </tbody>
                </table>
            </div>
        `;
    }

    async _init() {

        const tbody = this.shadowRoot.getElementById("record-container");
        const n = 10;
        const dbName = DB_CONFIG.name; 
        const storeName = DB_CONFIG.stores.record;
        const version = 1;
        const db = await database.openDB(dbName, storeName, version);

        const count = await database.getRecordCount(db, storeName);

        if (!tbody) return;
        tbody.innerHTML = "";

        if (count === 0) {
            tbody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>タイピングの記録はまだありません。</td></tr>";
            return;          
        }

        this._renderTopNTable(db, storeName, n, tbody);
    }

    async _renderTopNTable(db, storeName, n, tbody) {
        try {
            const data = await database.getTopNData(db, storeName, n);
            data.forEach(item => {
                const tr = document.createElement("tr");
                
                const timeLimit = document.createElement("td");
                timeLimit.textContent = item.timeLimit;
                
                const averageTypingSpeed = document.createElement("td"); 
                averageTypingSpeed.textContent = item.averageTypingSpeed

                const charactersCount = document.createElement("td");
                charactersCount.textContent = item.charactersCount;

                const typoCount = document.createElement("td");
                typoCount.textContent = item.typoCount;

                const wordsTypedCount = document.createElement("td");
                wordsTypedCount.textContent = item.wordsTypedCount;

                const tag = document.createElement("td");
                const p = document.createElement("p");
                p.textContent = item.tag; 
                p.className = "tag";
                if (
                    item.tag === "html tags" ||
                    item.tag === "html attributes" 
                ) {
                    p.classList.add("html");
                } else if (
                    item.tag === "css property" ||
                    item.tag === "css pseudo classes" || 
                    item.tag === "css pseudo elements" ||
                    item.tag === "css @rule" ||
                    item.tag === "css func"
                ) {
                    p.classList.add("css");
                } else if (
                    item.tag === "JS Built-in objects" || 
                    item.tag === "JS Expressions&operators" ||
                    item.tag === "JS Statements&declarations" || 
                    item.tag === "JS Functions" || 
                    item.tag === "JS Classes"
                ) {
                    p.classList.add("javascript");
                }
                tag.appendChild(p);            

                const timestamp = document.createElement("td");
                timestamp.textContent = item.timestamp.toLocaleString();

                tr.appendChild(timeLimit);
                tr.appendChild(averageTypingSpeed);
                tr.appendChild(charactersCount);
                tr.appendChild(typoCount);
                tr.appendChild(wordsTypedCount);
                tr.appendChild(tag);
                tr.appendChild(timestamp);
                tbody.appendChild(tr);
            });

            console.log(`${data.length}件のデータをテーブルに表示しました`);
        
        } catch (error) {
        
            console.error("テーブル描画エラー:", error);
        
        }
    }
}

customElements.define("record-table", RecordTable);



