/**
 * format
 * https://www.google.com/search?q=%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9B%E0%B8%A5%E0%B8%B9%E0%B8%81&source=lnms&tbm=isch&sa=X&bih=722&dpr=1.25#imgrc=b7zusakvN2oeSM
 * https://www.google.com/search?q={keyword}&source={lnms}&tbm={isch}
 * from my guess the tbm params that value is "isch" mean that page is from "Image tab"
 */

const express = require("express");
const cors = require("cors");

const Page = require("./libs/pageInstance");
const { writeFileSync } = require("./utils/writeFile");
const {
    getPageContentFromKeyword,
    getPreferredPart,
    extractLinkFromContent,
} = require("./libs/googleScrapFuncs");
const { filterExistedLinks } = require("./libs/imageExist");

const app = express();
app.use(cors());

/**
 * main link for get image from search keyword
 * for example /image?keyword=วัดพระแก้ว
 */
app.get("/image", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) throw new Error("must provide keyword to get images");

    const pageInstance = new Page();
    await pageInstance.initialize();

    const page = pageInstance.getPage();

    const pageContent = await getPageContentFromKeyword(keyword, page);

    const extractedData = getPreferredPart(pageContent);
    const optimizedLinks = extractLinkFromContent(extractedData);

    const existedLinks = await filterExistedLinks(optimizedLinks);

    await writeFileSync("index.json", JSON.stringify(existedLinks));
    res.json(existedLinks);
});

app.listen(8081, () => {
    console.log("Listening on port 3000");
});
