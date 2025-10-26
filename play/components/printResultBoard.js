import database from "/TypFlow/utility/indexedDB/database.js";
import { DB_CONFIG } from "/TypFlow/utility/indexedDB/dbConfig.js";

class PrintResultBoard extends HTMLElement {
    isOpen = false;
    resultData = null;

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <style>
                dialog::backdrop {
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(5px);
                }
                dialog {
                    background: var(--primary-background-color);
                    border: none;
                    border-radius: 2px;
                    width: clamp(275px, 50%, 500px);
                    padding: 10px;
                }
                .result > h1 {
                    margin: 0 0 15px 0;
                    font-size: 1.5rem;
                    text-align: center;
                    color: var(--primary-color);
                }
                .dialog-btn-boxs {
                    margin-left: auto;
                    display: flex;
                    justify-content: right;
                }             
                table {
                    width: 100%;
                    border-radius: 2px;
                    overflow: hidden;
                    border-collapse: collapse;
                    margin: 0 0 15px 0;
                }
                #result-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    background: var(--sub-background-color);
                }
                tr:nth-of-type(odd) {
                    background: var(--primary-background-color2);
                }
                td {
                    text-align: center;
                    width: 50%;
                    padding: 10px;
                    color: var(--primary-color);
                }
                .result-save-btn > button{
                    width: 130px;
                    height: 40px;
                    margin: 0 10px 0 0;
                    background: orange;
                    border: none;
                    border-radius: 2px;
                    color: var(--primary-color);
                }
                .result-close-btn > button {
                    width: 80px;
                    height: 40px;           
                    background: var(--primary-background-color2); 
                    border: none;
                    border-radius: 2px;  
                    color: var(--primary-color);  
                }
            </style>
            <dialog>
                <div>
                    <table>
                        <thead class="result">
                            <tr>
                                <td id="result-title" colspan="2">タイピング結果</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="time-limit-label">制限時間: </td>
                                <td id="time-limit"></td>
                            </tr>
                            <tr>
                                <td id="average-typing-speed-label">平均打鍵速度(秒): </td>
                                <td id="average-typing-speed"></td>
                            </tr>
                            <tr>
                                <td id="characters-count-label">打鍵数: </td>
                                <td id="characters-count"></td>
                            </tr>
                            <tr>
                                <td id="typo-count-label">タイポ: </td>
                                <td id="typo-count"></td>
                            </tr>
                            <tr>
                                <td id="words-typed-count-label">打鍵単語数: </td>
                                <td id="words-typed-count"></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="dialog-btn-boxs">
                        <div class="result-save-btn">
                            <button type="button" id="result-save-btn">結果を保存する</button>
                        </div>
                        <div class="result-close-btn">
                            <button type="button" id="result-close-btn">閉じる</button>
                        </div>
                    </div>        
                </div>
            </dialog>
        `;
        this.init();
    }

    init() {
        const root = this.shadowRoot;
        let pointer = 0;

        const f_save = () => {
            const typingBoard = document.querySelector("typing-board");
            this.save();
            typingBoard.reset();
            const dialog = root.querySelector("dialog");
            dialog.close();
            this.isOpen = false;
        }

        const resultSaveBtn = root.getElementById("result-save-btn");
        resultSaveBtn.addEventListener("click", () => {
            f_save();
            const typingBoard = document.querySelector("typing-board");
            typingBoard.typingManager.state = "starting";
        });

        resultSaveBtn.addEventListener("keydown", (event) => {
            if (event.key==="Enter") {
                f_save();
            }
        });

        const f_close = () => {
            const typingBoard = document.querySelector("typing-board");
            typingBoard.reset();
            const dialog = root.querySelector("dialog");
            dialog.close();
            this.isOpen = false;
            pointer = 0;
        }

        const resultCloseBtn = root.getElementById("result-close-btn");
        resultCloseBtn.addEventListener("click", () => {
            f_close();
            const typingBoard = document.querySelector("typing-board");
            typingBoard.typingManager.state = "starting";
        });

        resultCloseBtn.addEventListener("keydown", (event) => {
            if (event.key==="Enter") {
                f_close();
            }
        });

        const focusElems = [
            root.getElementById("result-save-btn"),
            root.getElementById("result-close-btn")
        ];
        
        root.addEventListener("keydown", (event) => {
            event.preventDefault();
            if (event.key!=="Tab") return;
            if (event.shiftKey) {
                if (pointer>0) {
                    pointer--;
                    focusElems[pointer].focus();
                } else {
                    pointer = focusElems.length-1;
                    focusElems[pointer].focus();
                }
            } else {
                if (pointer<(focusElems.length-1)) {
                    pointer++;
                    focusElems[pointer].focus();
                } else {
                    pointer = 0;
                    focusElems[pointer].focus();
                }
            }
        });
    }

    open(resultData) {
        const root = this.shadowRoot;
        this.resultData = resultData;
        const typingBoard = document.querySelector("typing-board");
        const dialog = root.querySelector("dialog");
        dialog.showModal();
        const timeLimit = root.getElementById("time-limit");
        const averageTypingSpeed = root.getElementById("average-typing-speed");
        const charactersCount = root.getElementById("characters-count");
        const typoCount = root.getElementById("typo-count");
        const wordsTypedCount = root.getElementById("words-typed-count");

        timeLimit.textContent = typingBoard.timeManager.displayTime(resultData.timeLimit);
        averageTypingSpeed.textContent = `毎秒 ${resultData.averageTypingSpeed}`;
        charactersCount.textContent = resultData.charactersCount;
        typoCount.textContent = resultData.typoCount;
        wordsTypedCount.textContent = resultData.wordsTypedCount;
        this.isOpen = true;
    }

    getResult() {
        const typingBoard = document.querySelector("typing-board");
        return {
            timeLimit: typingBoard.timeManager.timeLimit,
            averageTypingSpeed: (Number(typingBoard.typingManager.result.correctChar) / Number(typingBoard.timeManager.timeLimit)).toFixed(2),
            charactersCount: typingBoard.typingManager.result.correctChar,
            typoCount: typingBoard.typingManager.result.typoChar,
            wordsTypedCount: typingBoard.typingManager.result.completeText,
        }
    }

    async save() {
        const record = this.getResult();
        record.tag = localStorage.getItem("typing-target") ?? "html tags";
        record.timestamp = new Date();

        const dbName = DB_CONFIG.name;
        const storeName = DB_CONFIG.stores.record;
        const db = await database.openDB(dbName, storeName);
        const recordCount = await database.getRecordCount(db, storeName);

        if (recordCount>99) {
            await database.deleteOldestData(db, storeName);
            console.log("一件削除");
        }
        const userId = await database.addData(db, storeName, record);
        console.log("追加されたID:", userId);
    }
}
customElements.define("print-result-board", PrintResultBoard);
