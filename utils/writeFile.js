const fs = require("fs");

const writeFileSync = (path, contents) => {
    return new Promise((res, rej) => {
        fs.writeFileSync(path, contents, (err) => {
            if (err) {
                rej(err);
            }
        });
        res();
    });
};

module.exports = {
    writeFileSync,
};
