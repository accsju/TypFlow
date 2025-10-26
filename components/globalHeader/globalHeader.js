class GlobalHeader extends HTMLElement {
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
                * {
                    color: var(--primary-color);
                }
                header {
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    height: 50px;
                    background: var(--primary-background-color);
                    padding: 0 0 0 10px;
                    border-bottom: 1px solid var(--primary-background-color2);
                }       
                a {
                    text-decoration: none;
                    transition: .3s;
                    border-radius: 5px;
                    padding: 5px 7px;
                }
                a:focus {
                    outline: 1px solid black;
                }
                a:hover {
                    color: var(--active-color);
                    background: var(--sub-background-color);
                    opacity: .6;
                }
                .navigation {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;        
                }
                .game-menu {
                    display: flex;
                    margin: 0 10px 0 30px;
                }   
                .game-menu > div {
                    display: grid;
                    place-items: center;
                    padding: 5px 10px;
                }         
                .game-menu > div[data-focus="true"] > a {
                    color: var(--active-color);
                    background: var(--sub-color);
                }
                .smart-menu {
                    width: 55px;
                    height: 50px;
                    display: none;
                    place-items: center;
                }
                .smart-menu button {
                    padding: 5px;
                    opacity: .6s;
                    border-radius: 5px;
                    display: grid;
                    place-items: center;
                    border: none;
                    color: var(--primary-color);
                }
                @media screen and (max-width: 650px) {
                    header {
                        justify-content: space-between;
                    }
                    .navigation {
                        display: none;                        
                    }
                    .navigation.open{
                        display: block;
                        position: fixed;
                        top: 50.5px;
                        left: 0;
                        min-height: calc(100vh - 51px);
                        background: var(--primary-background-color);
                    }
                    header:has(.navigation.open) {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: calc(100% - 10px);
                    }
                    .navigation.open .game-menu {
                        padding: 10px;
                        margin: 0;
                    }
                    .smart-menu {
                        display: grid;
                    }
                }
            </style>
            <header>
                <div>
                    <site-logo></site-logo>
                </div>
                <div class="navigation" id="navigation">
                    <div class="game-menu">
                        <div id="play" data-focus="false">
                            <a href="/TypFlow/play/index.html">遊ぶ</a>
                        </div>
                        <div id="setting" data-focus="false">
                            <a href="/TypFlow/setting/index.html">設定</a>
                        </div>
                        <div id="record" data-focus="false">
                            <a href="/TypFlow/record/index.html">記録</a>
                        </div>
                        <div id="news" data-focus="false">
                            <a href="/TypFlow/news/index.html">お知らせ</a>
                        </div>
                    </div>
                </div>
                <div class="smart-menu">
                    <button type="button" id="menu">
                        <img src="/TypFlow/public/images/icons/menu.svg" alt="メニュー" />
                    </button>
                </div>    
            </header>
        `;
    }

    _init() {
        const play = this.shadowRoot.getElementById("play");
        const setting = this.shadowRoot.getElementById("setting");
        const record = this.shadowRoot.getElementById("record");
        const news = this.shadowRoot.getElementById("news");

        if (window.location.href.endsWith("/play/index.html")) {
            play.dataset.focus = "true";
        } else if (window.location.href.endsWith("/setting/index.html")) {
            setting.dataset.focus = "true";
        } else if (window.location.href.endsWith("/record/index.html")) {
            record.dataset.focus = "true";
        } else if (window.location.href.endsWith("/news/index.html")) {
            news.dataset.focus = "true";
        } 
        this._menu();
    }
    
    _menu() {
        const navigation = this.shadowRoot.getElementById("navigation");
        const menu = this.shadowRoot.getElementById("menu");
        const playLink = this.shadowRoot.getElementById("play").children[0];
        menu.addEventListener("click", () => {
            navigation.classList.toggle("open");
            if (navigation.className==="navigation open") {
                playLink.focus();
            }
        });
    }
};

customElements.define("global-header", GlobalHeader);
