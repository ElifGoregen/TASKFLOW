
const validateTask = (req, res, next) => {

    const {
        title,
        description,
        priority,
        assignee,
        contributors,
        completed
    } = req.body || {};

    // İstek gövdesi kontrolü
    if (
        !req.body ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
    ) {
        return res.status(400).json({
            message: "Geçerli bir görev verisi gönderilmelidir."
        });
    }

    // Başlık kontrolü
    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "Görev başlığı zorunludur."
        });
    }

    // Açıklama kontrolü
    if (!description || typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
            message: "Görev açıklaması zorunludur."
        });
    }

    // Öncelik kontrolü
    if (
        priority !== undefined &&
        !["low", "medium", "high"].includes(priority)
    ) {
        return res.status(400).json({
            message: "Öncelik low, medium veya high olmalıdır."
        });
    }

    // Sorumlu çalışan kontrolü
    if (
        assignee !== undefined &&
        (typeof assignee !== "string" || !assignee.trim())
    ) {
        return res.status(400).json({
            message: "Sorumlu çalışan adı geçerli olmalıdır."
        });
    }

    // Katkıda bulunanlar kontrolü
    if (contributors !== undefined) {

        if (!Array.isArray(contributors)) {
            return res.status(400).json({
                message: "Contributors bir dizi olmalıdır."
            });
        }

        if (contributors.some(name =>
            typeof name !== "string" || !name.trim()
        )) {
            return res.status(400).json({
                message: "Katkıda bulunan çalışan isimleri geçerli olmalıdır."
            });
        }
    }

    // Tamamlanma durumu kontrolü
    if (
        completed !== undefined &&
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            message: "Completed değeri true veya false olmalıdır."
        });
    }

    next();
};


const validateTaskUpdate = (req, res, next) => {

    const {
        title,
        description,
        priority,
        assignee,
        contributors,
        completed
    } = req.body || {};

    // İstek gövdesi kontrolü
    if (
        !req.body ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
    ) {
        return res.status(400).json({
            message: "Geçerli bir güncelleme verisi gönderilmelidir."
        });
    }

    // Boş güncelleme kontrolü
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Güncelleme için en az bir alan gönderilmelidir."
        });
    }

    // Başlık kontrolü
    if (
        title !== undefined &&
        (typeof title !== "string" || !title.trim())
    ) {
        return res.status(400).json({
            message: "Başlık boş olamaz."
        });
    }

    // Açıklama kontrolü
    if (
        description !== undefined &&
        (typeof description !== "string" || !description.trim())
    ) {
        return res.status(400).json({
            message: "Açıklama boş olamaz."
        });
    }

    // Öncelik kontrolü
    if (
        priority !== undefined &&
        !["low", "medium", "high"].includes(priority)
    ) {
        return res.status(400).json({
            message: "Öncelik low, medium veya high olmalıdır."
        });
    }

    // Sorumlu çalışan kontrolü
    if (
        assignee !== undefined &&
        (typeof assignee !== "string" || !assignee.trim())
    ) {
        return res.status(400).json({
            message: "Sorumlu çalışan adı geçerli olmalıdır."
        });
    }

    // Katkıda bulunanlar kontrolü
    if (contributors !== undefined) {

        if (!Array.isArray(contributors)) {
            return res.status(400).json({
                message: "Contributors bir dizi olmalıdır."
            });
        }

        if (contributors.some(name =>
            typeof name !== "string" || !name.trim()
        )) {
            return res.status(400).json({
                message: "Katkıda bulunan çalışan isimleri geçerli olmalıdır."
            });
        }
    }

    // Tamamlanma durumu kontrolü
    if (
        completed !== undefined &&
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            message: "Completed değeri true veya false olmalıdır."
        });
    }

    next();
};


module.exports = {
    validateTask,
    validateTaskUpdate
};
