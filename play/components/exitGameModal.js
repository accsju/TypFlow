class ExitGameModal extends HTMLElement {
    isOpen = false;
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
                }
                .title {
                    text-align: center;
                    font-size: 1.4rem;
                    margin: 0;
                    color: var(--primary-color);
                }
                .explain {
                    color: var(--primary-color);
                    padding: 0 25px 20px 25px;
                    text-align: center;
                }
                .button-box {
                    display: flex;
                    justify-content: space-evenly;
                }
                .cancel button {
                    background: orange;
                    width: 100px;
                    height: 30px;
                    border-radius: 5px;
                    border: none;
                    margin: 0 10px 0 0;
                }
                .ok button {
                    background: var(--primary-background-color2);
                    width: 100px;
                    height: 30px;
                    border-radius: 5px;
                    border: none;
                }
            </style>
            <dialog>
                <div>
                    <h1 class="title">確認</h1>
                    <p class="explain">タイピングゲームを終了しますか？</p>
                    <div class="button-box">
                        <div class="cancel">
                            <button type="button" id="CANCEL">キャンセル</button>
                        </div>
                        <div class="ok">
                            <button type="button" id="OK">OK</button>
                        </div>
                    </div>
                </div>
            </dialog>
        `;

        const root = this.shadowRoot;
        let pointer = 0;

        const f_cancel = () => {
            const dialog = root.querySelector("dialog");
            dialog.close();
            const typingBoard = document.querySelector("typing-board");
            if (typingBoard.typingManager.state==="waiting") {
                typingBoard.typingManager.state = "playing";
                typingBoard.timeManager.startTimer();
            }
            const gameStopBtn = document.querySelector("typing-board").shadowRoot.getElementById("game-stop-btn");
            gameStopBtn.blur();
            this.isOpen = false;
        }

        const CANCEL = root.getElementById("CANCEL");
        CANCEL.addEventListener("click", () => f_cancel());
        CANCEL.addEventListener("keydown", (event) => {         
            if (event.key==="Enter"&&!event.repeat) {
                event.stopPropagation();
                f_cancel();
            }
        });

        const f_ok = () => {
            const dialog = root.querySelector("dialog");
            dialog.close();
            const typingBoard = document.querySelector("typing-board");
            if (typingBoard.typingManager.state==="waiting") {
                typingBoard.typingManager.state = "ending";
                typingBoard.reset();
            }
            const gameStopBtn = document.querySelector("typing-board").shadowRoot.getElementById("game-stop-btn");
            gameStopBtn.blur();
            this.isOpen = false;
            pointer = 0;      
        }

        const OK = root.getElementById("OK");
        OK.addEventListener("click", () => {
            f_ok();
            const typingBoard = document.querySelector("typing-board");
            typingBoard.typingManager.state = "starting";
        });
        OK.addEventListener("keydown", (event) => {
            if (event.key==="Enter"&&!event.repeat) {
                f_ok();
            }
        });

        const focusElems = [
            root.getElementById("CANCEL"),
            root.getElementById("OK")
        ];
        root.addEventListener("keydown", (event) => {
            event.preventDefault();
            if (event.key !== "Tab") return;
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
    open() {
        const root = this.shadowRoot;
        setTimeout(() => {
            const dialog = root.querySelector("dialog");
            dialog.showModal();
        }, 10);
        this.isOpen = true;        
    }
};
customElements.define("exit-game-modal", ExitGameModal);