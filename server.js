/**
 * format
 * https://www.google.com/search?q=%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9B%E0%B8%A5%E0%B8%B9%E0%B8%81&source=lnms&tbm=isch&sa=X&bih=722&dpr=1.25#imgrc=b7zusakvN2oeSM
 * https://www.google.com/search?q={keyword}&source={lnms}&tbm={isch}
 * from my guess the tbm params that value is "isch" mean that page is from "Image tab"
 */

const PORT = process.env.PORT || 4002;

const express = require("express");
const cors = require("cors");

const PuppeteerPage = require("./libs/pageInstance");
const { writeFileSync } = require("./utils/writeFile");
const {
    getPageContentFromKeyword,
    getPreferredPart,
    extractLinkFromContent,
} = require("./libs/googleScrapFuncs");
const {
    mapFacebookLinks,
    getFacebookImage,
    isFacebookLink,
} = require("./libs/facebookScrapFuncs");
const { filterExistedLinks } = require("./libs/imageExist");
const { default: axios } = require("axios");

const app = express();
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

/**
 * main link for get image from search keyword
 * for example /image?keyword=วัดพระแก้ว
 */
app.get("/image", async (req, res) => {
    const { keyword, amount } = req.query;
    if (!keyword) throw new Error("must provide keyword to get images");

    const pageInstance = new PuppeteerPage();
    await pageInstance.initialize();

    const page = pageInstance.getPage();

    const pageContent = await getPageContentFromKeyword(keyword, page);

    writeFileSync("content.html", pageContent);

    const extractedData = getPreferredPart(pageContent);
    const optimizedLinks = extractLinkFromContent(extractedData);

    const filterOutFacebookLinks = optimizedLinks.filter(
        (link) => !isFacebookLink(link.url)
    );

    // const existedLinks = await (
    //     await filterExistedLinks(optimizedLinks)
    // ).slice(0, Math.min(amount, optimizedLinks.length) || 10);

    // const furtherLinks = await mapFacebookLinks(existedLinks , page);

    // await writeFileSync("index.json", JSON.stringify(furtherLinks));
    console.log({
        temple: keyword,
        images: filterOutFacebookLinks.slice(0, amount || 30),
    });
    res.json({
        temple: keyword,
        images: filterOutFacebookLinks.slice(0, amount || 30),
    });
});

app.get("/facebook", async (req, res) => {
    const pageInstance = new PuppeteerPage();
    await pageInstance.initialize();

    const page = pageInstance.getPage();

    const link =
        "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=2924348144281926";
    const imageLink = await getFacebookImage(link, page);
    res.json({ link: imageLink });
});

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/test", async (req, res) => {
    const { data } = await axios.get("http://192.168.1.44:8080/province");
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
