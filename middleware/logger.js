
const logger = (req, res, next) => {
    const time = new Date().toLocaleString("tr-TR");

    console.log(
        `[${time}] ${req.method} isteği geldi: ${req.url}`
    );

    next();
};

module.exports = logger;
