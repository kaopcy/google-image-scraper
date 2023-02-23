const getPageContentFromKeyword = async (keyword, page) => {
    await page.goto(
        `https://www.google.com/search?q=${keyword}&sxsrf=AJOqlzU26eIJ3D5z7-qORFTa6_JSCgTSEg:1675872158746&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjY0telpob9AhXq8DgGHWzqB2AQ_AUoAnoECAIQBA&biw=1536&bih=722&dpr=1.25`,
        {
            waitUntil: "domcontentloaded",
        }
    );
    const pageContent = await page.content();
    return pageContent;
};

/**
 * This function will cut of unwanted part
 * google page always have same page pattern 
 * image url contents always be right after sentence "AF_initDataCallback({key: 'ds:1',"
 */
const getPreferredPart = (pageContent) => {
    const regex = /AF_initDataCallback\({key: 'ds:1',[\s\S]*\}/;
    const result = regex.exec(pageContent);
    return result?.[0];
};

const extractLinkFromContent = (pageContent) => {
    let regex = /\[1,\[0,.*?(https?:\/\/[^\s"]+)"/g;
    let links = [];
    let match;

    /**
     * the page contents is in pattern [1,[0 ==> https://encrypted.. => preferred link
     * so at first we have to eliminate link that placed before our prefered link
     */
    while ((match = regex.exec(pageContent)) !== null) {
        pageContent = pageContent.replace(match[1], "");
    }

    /**
     * after previous repeat the same regex but this time we extract prefered link instead
     */
    while ((match = regex.exec(pageContent)) !== null) {
        pageContent = pageContent.replace(match[1], "");
        links.push(match[1]);
    }

    /**
     * for getting source of image the google content will have pattern source always follow after image link
     */
    let sourceLink = []
    while ((match = regex.exec(pageContent)) !== null) {
        pageContent = pageContent.replace(match[1], "");
        sourceLink.push(match[1]);
    }

    /**
     * links that got from scraping are use "\u003d" instead of "=" and "\u0026" instead of "&"
     * example: https://www.google.com/search?q\uu3dวัด\u0026id\u003d90%*12389
     */
    const optimizedLinks = links.map((link) =>
        link.replace(/\\u003d/g, "=").replace(/\\u0026/g, "&")
    );

    const linkWithSource = optimizedLinks.map((link , index) => ({
        imageLink: link,
        source: sourceLink[index]
    }))

    return linkWithSource;
};

module.exports = {
    getPageContentFromKeyword,
    getPreferredPart,
    extractLinkFromContent
};
