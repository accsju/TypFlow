class SiteLogo extends HTMLElement {
    static observedAttributes = [];
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <style>
                .logo {
                    font-size: 1.5rem;
                    transition: .9s;
                }
                .logo > a {
                    color: var(--primary-color);
                    text-decoration: none;
                    padding: 5px;
                    font-family: cursive, sans-serif;
        
                    background: radial-gradient(circle,rgba(240, 237, 34, 1) 0%, rgba(255, 51, 51, 1) 0%, rgba(252, 176, 69, 1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                      /* Firefox用 */
                    background-clip: text;
                    color: transparent;
                }
                .logo:hover {
                    opacity: .8 ;
                }
            </style>
            <div>
                <h1 class="logo">
                    <a href="/index.html" target="_self">TypFlow</a>
                </h1>
            </div>
        `;
    }
};
customElements.define("site-logo", SiteLogo);