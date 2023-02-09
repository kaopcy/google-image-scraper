const puppeteer = require("puppeteer");

class Singleton {
    #page = null;
    constructor() {
        if (Singleton._instance) {
            return Singleton._instance;
        }
        Singleton._instance = this;
    }

    async initialize() {
        if (this.#page) return;
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/google-chrome",
            args: ["--no-sandbox", "--disable-gpu"],
        });
        this.#page = await browser.newPage();
    }

    getPage() {
        if (!this.#page) {
            throw new Error("this instance must initialize first");
        }
        return this.#page;
    }
}

module.exports = Singleton;
