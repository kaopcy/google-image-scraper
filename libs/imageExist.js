const axios = require("axios").default;

const filterExistedLinks = async (oldLinks) => {
    /**
     * use this algo because i want to keep the same sequence as the google response
     */
    let newLinks = [];
    try {
        const promises = oldLinks.map(async (link , index) => {
            try {
                console.log(`'start getlink ${index}'`)
                await axios.get(link);
                newLinks = oldLinks.filter((e) => e !== link);
            } catch (error) {}
        });
        await Promise.all(promises);
    } catch (error) {}
    return newLinks;
};

module.exports = {
    filterExistedLinks,
};
