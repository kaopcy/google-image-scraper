const { writeFileSync } = require("../utils/writeFile");

const puppeteer = require("puppeteer");

const isFacebookLink = (link) => {
    const facebookLinkPattern = "lookaside.fbsbx.com";
    return link.includes(facebookLinkPattern);
};

const getImageFromPageContent = (pageContent) => {
    const regex = /prefetch_uris_v2":\[{"uri":"(.*?)"/;
    const result = pageContent.match(regex);
    return result?.[1]?.replace(/\\/g, "");
};

const getFacebookImage = async (link, page) => {
    await page.goto(link, {
        waitUntil: "domcontentloaded",
    });
    console.log('this is facebook link')
    const pageContent = await page.content();
    const image = getImageFromPageContent(pageContent);
    return image;
};

const mapFacebookLinks = async (existedLinks, page) => {
    let furtherLinks = [];

    for (const link of existedLinks) {
        if (isFacebookLink(link)) {
            const facebookLink = await getFacebookImage(link, page);
            furtherLinks.push(facebookLink);
        } else {
            furtherLinks.push(link);
        }
    }
    return furtherLinks;
};

module.exports = {
    getFacebookImage,
    isFacebookLink,
    mapFacebookLinks,
};
