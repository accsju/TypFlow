class NewsTable extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <style>
                * {
                    color: var(--primary-color);
                }
                .news-title {
                    text-align: center;
                }
                .news-title::before {
                    content: "●";
                    color: orange;
                    margin: 0 5px 0 0;
                }
                .news {
                    display: flex;
                    justify-content: space-evenly;
                    align-items: start;
                    border-bottom: 1px solid var(--primary-background-color2);
                    padding: 10px 0;
                }
                .date {
                    width: 90px;
                    padding: 5px;
                    margin: 5px 0 0 0;
                    background: var(--sub-color);
                    border-radius:5px;
                    color: var(--active-color);
                    font-size: .8rem;
                }
                .box {
                    padding: 5px 0;
                }
                .type {
                    background: orange;
                }
                .content {
                    margin: 5px 0 0 0;
                    font-size: .8rem;
                }
                @media screen and (max-width: 740px) {
                    .news {
                        display: block;
                    }
                }
            </style>
            <div>
                <div>
                    <h2 class="news-title">お知らせ</h2>
                </div>
                <div id="news-container"></div>
            </div>
        `;
        this.load();
    }
    load() {
        const root = this.shadowRoot;
        const newsContainer = root.getElementById("news-container");
        fetch("data/news.json") 
            .then(res => res.json())
            .then(newsList => {   
                newsList.forEach(item => {
                    const div = document.createElement("div");
                    div.classList.add("news");
                    div.innerHTML = `
                        <p class="date">${item.date}</p>
                        <div class="box">
                            <div>
                                <span>${item.title}</span>
                            </div>
                            <p class="content">${item.content}</p>
                        </div>
                    `;
                    newsContainer.appendChild(div);
                })
            })
    }
}
customElements.define("news-table", NewsTable);