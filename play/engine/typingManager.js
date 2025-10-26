class TypingManager {
    #progress = {
        STARTING: "starting",
        PLAYING: "playing",
        WAITING: "waiting",
        ENDING: "ending"   
    }
    state = null;
    loadingComplete = false;
    typedText = "";
    untypedText = ""; 
    textList = [];
    nextChar = "";
    result = {
        correctChar: 0,
        typoChar: 0,
        completeText: 0,
    }
    async init() {
        this.state = this.#progress.STARTING;
        this.textList = await this._loadTextList();
        this.loadingComplete = true;
    }
    async _loadTextList () {  
        const target = localStorage.getItem("typing-target") ?? "html tags";
        let module;
        let group;
        let fileName;

        if (target.startsWith("html")) {
            group = "html";
        } else if (target.startsWith("css")) {
            group = "css";
        } else if (target.startsWith("JS")) {
            group = "javascript";
        } 

        fileName = this._toFileName(target);
        
        try {
            module = await import(
                `/TypFlow/play/field/${group}/${fileName}.js`
            );
            return module.default;
        } catch (err) {
            console.error(`Failed to load: ${fileName}`, err);
            return [];
        }
    }
    _toFileName(text) {
        const arr = text.split(" ");
        if (arr.length<=1) return;
        for (let i=1;i<arr.length;i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }      
        return arr.join("");
    }
    _choiceText() {
        if (!this.textList.length) {
            console.warn("No textList loaded");
            return "";
        }
        return this.textList[Math.floor(Math.random()*this.textList.length)];
    }
    play() {
        const choiceText = this._choiceText();
        if (!choiceText) return;

        this.typedText = "";
        this.untypedText = choiceText;
        this.nextChar = choiceText.at(0);
        const typingBoard = document.querySelector("typing-board");
        if (!typingBoard || !typingBoard.getElements) {
            console.error("typing-board element not found or invalid");
            return;
        }
        const { typedText, untypedText } = typingBoard.getElements();
        typedText.textContent = "";
        untypedText.textContent = this.untypedText; 
        this.state = this.#progress.PLAYING;
    }
    eat(key) {
        if (key==="Shift" || this.state !== this.#progress.PLAYING) return;
        const root = document.querySelector("typing-board").shadowRoot;
        const charactersCount = root.getElementById("characters-count");
        const typoCount = root.getElementById("typo-count");
        const typingBoard = document.querySelector("typing-board");
        if (!typingBoard) return;
        let { typedText, untypedText } = typingBoard.getElements();
        if (this.nextChar===key) {

            this.result.correctChar++;
            if (charactersCount) {
                charactersCount.textContent = Number(charactersCount.textContent) + 1;
            }

            this.typedText += this.nextChar;
            this.untypedText = this.untypedText.slice(1);

            typedText.textContent = this.typedText;
            untypedText.textContent = this.untypedText;

            if (!this.untypedText.length) {
                this.result.completeText++;
                this.play();
                return;
            } 

            this.nextChar = this.untypedText.at(0);
        } else {
            this.result.typoChar++;
            if (typoCount) {
                typoCount.textContent = Number(typoCount.textContent) + 1;
            }
        }
    }
    reset() {
        this.typedText = "";
        this.untypedText = "";
        this.result = {
            correctChar: 0,
            typoChar: 0,
            completeText: 0
        }
    }
};
export default TypingManager;
