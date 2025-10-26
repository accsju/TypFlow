class TimeManager {
    #intervalID = null;
    remainingTime = null; 
    remainingTimeElem = null;
    progressElem = null;
    timeLimit = null;
    init() {
        const timeLimit = this.timeLimit;

        this.remainingTime = timeLimit;
        this.remainingTimeElem = document.querySelector("typing-board").shadowRoot.getElementById("remaining-time");
        this.progressElem = document.querySelector("typing-board").shadowRoot.getElementById("remaining-time-progress");

        if (this.remainingTimeElem) {
            this.remainingTimeElem.textContent = this.displayTime(this.remainingTime);
        }
        if (this.progressElem) {
            this.progressElem.max = timeLimit; 
            this.progressElem.value = timeLimit; 
        }
    }
    displayTime(time) {
        const m = Math.floor(time / 60);
        const s = time % 60;
        return `${m}分${s.toString().padStart(2, "0")}秒`;
    }
    startTimer() {
        const typingBoard = document.querySelector("typing-board");
        if (!typingBoard?.typingManager) {
            console.error("typingManager not found");
            return;
        }
        if (this.#intervalID) {
            clearInterval(this.#intervalID);
        }
        this.#intervalID = setInterval(()=>{
            const state = typingBoard.typingManager.state;
            if (state==="waiting" || state==="ending") {
                this.stopTimer();
                return;
            }
            
            if (this.remainingTime > 0) {
                this.remainingTime--;
            }
            if (this.remainingTimeElem) {
                this.remainingTimeElem.textContent = this.displayTime(this.remainingTime);
            }
            if (this.progressElem) {
                this.progressElem.setAttribute("value", this.remainingTime);
            }

            if (this.remainingTime<=0) {
                typingBoard.typingManager.state = "ending";
                const printResultBoard = document.querySelector("print-result-board");

                if (printResultBoard) {
                    const resultData = printResultBoard.getResult?.();
                    printResultBoard.open?.(resultData);
                }
                this.stopTimer();
            }
        }, 1000);
    }
    stopTimer() {
        if (this.#intervalID) {
            clearInterval(this.#intervalID);
            this.#intervalID = null;
        }
    }
    resetTimer() {
        this.stopTimer();
        this.remainingTime = this.timeLimit;
        if (this.remainingTimeElem) {
            this.remainingTimeElem.textContent = this.displayTime(this.remainingTime);
        }
        if (this.progressElem) {
            this.progressElem.max = this.timeLimit;
            this.progressElem.value = this.timeLimit;
        }
    }
}
export default TimeManager;
