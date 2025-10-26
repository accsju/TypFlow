class TypingSetting extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this._render();
        this._init();
    }

    static DEFAULT = {
        fontFamily: "sans-serif",
        fontSize: "2rem",
        fontColor: "orange",
        timeLimit: "180",
    };

    _render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                .typing-setting {
                    border-radius: 5px;
                    padding: 10px;
                }
                .setting-container > div {
                    margin: 5px 0 0 0;
                    display: flex;
                }
                h2 {
                    color: var(--primary-color);
                }
                label {
                    display: grid;
                    place-items: center;
                    margin: 0 10px 0 0;
                    width: 100px;
                    height: 35px;
                    font-size: .9rem;
                    color: var(--primary-color);
                }
                select {
                    width: 100px;
                    height: 35px;    
                    padding: 0 10px 0 10px;   
                    color: var(--primary-color); 
                }
                #reset-btn {
                    margin-top: 15px;
                    background: crimson;
                    color: white;
                    border: none;
                    border-radius: 5px; 
                    padding: 8px 16px;
                    cursor: pointer;
                    transition: .3s;
                }
                #reset-btn:hover {
                    background: tomato;
                }
            </style>
            <div class="typing-setting">
                <div>
                    <h2>ゲーム設定</h2>
                </div>
                <div class="setting-container">
                    <div>
                        <label for="font-family">FontFamily</label>
                        <select id="font-family">
                            <option value="sans-serif">sans-serif</option>
                            <option value="cursive">cursive</option>
                            <option value="serif">serif</option>
                            <option value="Georgia">Georgia</option>
                        </select>
                    </div>
                    <div>
                        <label for="font-size">FontSize</label>
                        <select id="font-size">
                            <option value="2rem">2rem</option>
                            <option value="2.2rem">2.2rem</option>
                            <option value="2.4rem">2.4rem</option>
                        </select>
                    </div>
                    <div>
                        <label for="font-color">FontColor</label>
                        <select id="font-color">
                            <option value="orange">orange</option>
                            <option value="teal">teal</option>
                            <option value="deepskyblue">deepskyblue</option>
                            <option value="crimson">crimson</option>
                            <option value="tomato">tomato</option>
                        </select>
                    </div>
                    <div>
                        <label for="time-limit">TimeLimit</label>
                        <select id="time-limit">              
                            <option value="180">3分00秒</option>
                            <option value="240">4分00秒</option>
                            <option value="300">5分00秒</option>
                        </select>
                    </div>
                </div>
                <button id="reset-btn">設定をリセット</button>
            </div>
        `;
    }

    _init() {
        const root = this.shadowRoot;
        const saved = localStorage.getItem("typing-setting");
        const typingSetting = saved ? JSON.parse(saved) : { ...TypingSetting.DEFAULT };

        const map = {
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-color": "fontColor",
            "time-limit": "timeLimit"
        };
        
        Object.entries(map).forEach(([id, key]) => {
            const select = root.getElementById(id);
            select.value = typingSetting[key] || TypingSetting.DEFAULT[key];
            select.addEventListener("change", (e) => {
                typingSetting[key] = e.target.value;
                this._saveSetting(typingSetting);
            });
        });

        const resetBtn = root.getElementById("reset-btn");
        resetBtn.addEventListener("click", () => {
            this._resetSettings(root, map);
        })
    }     

    _saveSetting(setting) {
        localStorage.setItem("typing-setting", JSON.stringify(setting));
    }
       
    _resetSettings(root, map) {
        this._saveSetting(TypingSetting.DEFAULT);
        Object.entries(map).forEach(([id, key]) => {
            const select = root.getElementById(id);
            select.value = TypingSetting.DEFAULT[key];
        });
    }
}

customElements.define("typing-setting", TypingSetting);