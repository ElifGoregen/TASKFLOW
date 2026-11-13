
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// JSON verilerini okuyabilmek için
app.use(express.json());

// Gelen istekleri konsola yazdırma
const logger = require("./middleware/logger");

app.use(logger);

// Router bağlantısı
const taskRoutes = require("./routes/taskRoutes");

app.use("/tasks", taskRoutes);

// 404 - Bulunamayan endpoint kontrolü
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint bulunamadı."
    });
});

// Hata yönetimi middleware'i
app.use((err, req, res, next) => {

    if (res.headersSent) {
        return next(err);
    }

    // Hatalı JSON kontrolü
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "Geçersiz JSON formatı."
        });
    }

    // Beklenmeyen sunucu hataları
    console.error(err);

    res.status(500).json({
        message: "Sunucu hatası oluştu."
    });
});

// Uygulamayı dışarı aktar
module.exports = app;

// Sunucuyu yalnızca doğrudan çalıştırıldığında başlat
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`TASKFLOW server running on port ${PORT}`);
    });
}
