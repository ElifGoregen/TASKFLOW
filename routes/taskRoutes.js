
const express = require("express");
const {
    validateTask,
    validateTaskUpdate
} = require("../middleware/validateTask");
const router = express.Router();

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskReport
} = require("../controllers/taskController");

// Görev listeleme
router.get("/", getAllTasks);
//Raporları görüntüleme
router.get("/report", getTaskReport);
// Görev detayı
router.get("/:id", getTaskById);

// Görev ekleme
router.post("/", validateTask, createTask);

// Görev güncelleme
router.put("/:id", validateTaskUpdate, updateTask);

// Görev silme
router.delete("/:id", deleteTask);

module.exports = router;
