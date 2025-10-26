import TypingManager from "/TypFlow/play/engine/typingManager.js";
import TimeManager from "/TypFlow/play/engine/timeManager.js";

class TypingBoard extends HTMLElement {
    typingManager = null;
    timeManager = null;
    message = "Enterキーを押して始めよう。";
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <style>        
                .typing-header {
                    display: flex;
                    justify-content: right;
                    align-items: center;
                    width: 100%;
                    height: 50px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    border-bottom: 1px solid var(--fixed-color1);
                    background: var(--primary-background-color);
                } 
                .remaining-time-box {
                    width: 150px;
                    margin: 0 15px 0 0;
                }
                .remaining-time-progress > progress {
                    height: 18px;
                }
                .remaining-time {
                    border-radius: 15px;
                    height: 30px;
                    padding: 0 10px 0 10px;
                    color: var(--primary-color);
                }
                .game-stop-btn {
                    display: grid;
                    place-items: center;
                    border-radius: 15px;
                    width: 80px;
                    height: 30px;
                    margin: 0 10px 0 0;
                    background: orange;
                    transition: .8s;
                }
                .game-stop-btn:hover {
                    background: orangered;
                }
                .game-stop-btn > button {
                    color: var(--primary-color);
                    border-radius: 15px;
                    width: 80px;
                    height: 30px;
                    background: none;
                    border: none;        
                }
                .game-status {
                    display: flex;
                    justify-content: left;
                    align-items: center;
                }
                .characters-count-box {
                    padding: 10px 5px;
                }
                .characters-label {
                    padding: 0 5px 0 0;
                    color: var(--primary-color);
                }
                .characters-count {
                    display: inline-block;
                    min-width: 50px;
                    text-align: right;
                    padding: 0 5px 0 5px;
                    background: var(--primary-background-color2);
                    border-radius: 5px;
                    color: var(--primary-color);
                }
                .typo-count-box {
                    padding: 10px 5px;
                }
                .typo-label {
                    padding: 0 5px 0 0;
                    color: var(--primary-color);
                }
                .typo-count {
                    display: inline-block;
                    min-width: 35px;
                    text-align: right;
                    padding: 0 5px 0 5px;
                    background: var(--primary-background-color2);
                    border-radius: 5px;
                    color: var(--primary-color);
                }             
                .alphabet-base {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 300px;
                }
                .alphabet-typed-text {
                    color: orange;
                    font-weight: bold;
                    font-size: 2rem;
                }
                .alphabet-untyped-text {
                    color: var(--primary-color);
                    font-weight: bold;
                    font-size: 2rem;
                }
            </style>
            <header class="typing-header">
                <div class="remaining-time-box">
                    <div class="remaining-time-progress">
                        <progress max="300" value="300" id="remaining-time-progress"></progress>
                    </div>
                    <div class="remaining-time"><span>残り時間 </span><span id="remaining-time"></span></div>
                </div>
                <div class="game-stop-btn">
                    <button type="button" id="game-stop-btn">終了する</button>
                </div>
            </header>
            <div class="game-status">
                <div class="characters-count-box"><span class="characters-label">入力文字数</span><span class="characters-count" id="characters-count">0</span></div>
                <div class="typo-count-box"><span class="typo-label">タイポ</span><span class="typo-count" id="typo-count">0</span></div>
            </div>
            <div class="alphabet-base">
                <span class="alphabet-typed-text" id="alphabet-typed-text"></span><span class="alphabet-untyped-text" id="alphabet-untyped-text"></span>
            </div>
        `;
        this.init();
        this.setTypingSetting();
    }
    getElements() {
        return {
            typedText: this.shadowRoot.getElementById("alphabet-typed-text"),
            untypedText: this.shadowRoot.getElementById("alphabet-untyped-text")
        }
    }
    init() {
        const alphabetTypedText = this.shadowRoot.getElementById("alphabet-typed-text");
        const alphabetUntypedText = this.shadowRoot.getElementById("alphabet-untyped-text");

        alphabetTypedText.textContent = "";
        alphabetUntypedText.textContent = this.message;

        const typingManager = new TypingManager();
        const timeManager = new TimeManager();
        typingManager.init();
        this.typingManager = typingManager;
        this.timeManager = timeManager;

        const root = this.shadowRoot;
        document.addEventListener("keydown", main);
        function main(event) {
            const exitGameModal = document.querySelector("exit-game-modal");
            const printResultBoard = document.querySelector("print-result-board");
            if (
                exitGameModal.isOpen ||
                printResultBoard.isOpen
            ) {
                return;             
            }
            if (event.key==="Tab"&&typingManager.state!=="playing") {
                return; 
            }
            event.preventDefault();
            if (event.key==="Tab"&&typingManager.state==="playing") {
                const gameStopBtn = root.getElementById("game-stop-btn");
                gameStopBtn.focus();
                return;
            }
            if (typingManager.state==="starting"&&event.key==="Enter"&&typingManager.loadingComplete) {
                typingManager.play();
                timeManager.resetTimer();
                timeManager.startTimer();
                const gameStopBtn = root.getElementById("game-stop-btn");
                gameStopBtn.blur();
                return;
            }
            if (typingManager.state==="playing") {
                typingManager.eat(event.key);
                return;
            }
            if (typingManager.state==="ending") {
                typingManager.state = "starting";
            }
        }
        const gameStopBtn = root.getElementById("game-stop-btn");
        gameStopBtn.addEventListener("click", () => {
            if (typingManager.state==="playing") {
                const exitGameModal = document.querySelector("exit-game-modal");
                exitGameModal.open();
                typingManager.state = "waiting";
            }
        });
        gameStopBtn.addEventListener("keydown", (event) => {
            if (typingManager.state==="playing"&&event.key==="Enter") {
                const exitGameModal = document.querySelector("exit-game-modal");
                exitGameModal.open();
                typingManager.state = "waiting";
                const gameStopBtn = root.getElementById("game-stop-btn");
                gameStopBtn.blur();
            }
        });
    }

    reset() {
        const root = this.shadowRoot;
        const charactersCount = root.getElementById("characters-count");
        const typoCount = root.getElementById("typo-count");
        const { typedText, untypedText } = this.getElements();
        charactersCount.textContent = 0;
        typoCount.textContent = 0;
        typedText.textContent = "";
        untypedText.textContent = this.message;
        
        this.typingManager.reset();
        this.timeManager.resetTimer();
    }
    
    setTypingSetting() {
        const DEFAULT = {
            fontFamily: "sans-serif",
            fontSize: "2rem",
            fontColor: "orange",
            timeLimit: "180",
        };
        const saved = localStorage.getItem("typing-setting");
        const setting = saved ? JSON.parse(saved) : { ...DEFAULT };

        const { typedText, untypedText } = this.getElements();
        typedText.style.fontFamily = setting.fontFamily;
        untypedText.style.fontFamily = setting.fontFamily;
        typedText.style.fontSize = setting.fontSize;
        untypedText.style.fontSize = setting.fontSize;
        typedText.style.color = setting.fontColor;       
        this.timeManager.timeLimit = Number(setting.timeLimit);    
        this.timeManager.init();    
    }
}
customElements.define("typing-board", TypingBoard);

