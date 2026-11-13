
const fs = require("fs");
const path = require("path");

const { generateTaskReport } = require("../services/taskReportService");

// JSON dosyasının yolu
const tasksFilePath = path.join(__dirname, "../data/tasks.json");

// Görevleri JSON dosyasından okuma
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    return JSON.parse(data);
};

// Görevleri JSON dosyasına yazma
const writeTasks = (tasks) => {
    fs.writeFileSync(
        tasksFilePath,
        JSON.stringify(tasks, null, 2),
        "utf8"
    );
};

// Görev ID kontrolü
const validateTaskId = (req, res) => {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        res.status(400).json({
            message: "Geçersiz görev ID"
        });
        return null;
    }

    return taskId;
};

// Görevleri listeleme, filtreleme, arama, sıralama ve sayfalama
const getAllTasks = (req, res) => {
    const tasks = readTasks();

    const {
        priority,
        completed,
        search,
        sortBy,
        order,
        assignee,
        contributor
    } = req.query;

    let filteredTasks = [...tasks];

    // Önceliğe göre filtreleme
    if (priority) {
        const validPriorities = ["low", "medium", "high"];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Öncelik low, medium veya high olmalıdır."
            });
        }

        filteredTasks = filteredTasks.filter(
            task => task.priority === priority
        );
    }

    // Tamamlanma durumuna göre filtreleme
    if (completed !== undefined) {
        if (completed !== "true" && completed !== "false") {
            return res.status(400).json({
                message: "Completed değeri true veya false olmalıdır."
            });
        }

        const isCompleted = completed === "true";

        filteredTasks = filteredTasks.filter(
            task => task.completed === isCompleted
        );
    }

    // Başlık ve açıklamaya göre arama
    if (search !== undefined) {
        if (typeof search !== "string" || !search.trim()) {
            return res.status(400).json({
                message: "Arama parametresi boş olamaz."
            });
        }

        const searchTerm = search.trim().toLowerCase();

        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    // Sorumlu kullanıcıya göre filtreleme
    if (assignee !== undefined) {
        if (typeof assignee !== "string" || !assignee.trim()) {
            return res.status(400).json({
                message: "Sorumlu kullanıcı adı boş olamaz."
            });
        }

        filteredTasks = filteredTasks.filter(
            task =>
                (task.assignee || "Atanmamış").toLowerCase() ===
                assignee.trim().toLowerCase()
        );
    }

    // Katkıda bulunan kullanıcıya göre filtreleme
    if (contributor !== undefined) {
        if (typeof contributor !== "string" || !contributor.trim()) {
            return res.status(400).json({
                message: "Katkıda bulunan kullanıcı adı boş olamaz."
            });
        }

        filteredTasks = filteredTasks.filter(
            task =>
                Array.isArray(task.contributors) &&
                task.contributors.some(
                    name =>
                        name.toLowerCase() === contributor.trim().toLowerCase()
                )
        );
    }

    // Sıralama işlemi
    if (sortBy) {
        const validSortFields = ["id", "title", "priority"];

        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({
                message: "Sıralama alanı id, title veya priority olmalıdır."
            });
        }

        const sortOrder = order || "asc";

        if (sortOrder !== "asc" && sortOrder !== "desc") {
            return res.status(400).json({
                message: "Sıralama yönü asc veya desc olmalıdır."
            });
        }

        const priorityOrder = {
            low: 1,
            medium: 2,
            high: 3
        };

        filteredTasks.sort((a, b) => {
            let comparison;

            if (sortBy === "priority") {
                comparison =
                    priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === "title") {
                comparison = a.title.localeCompare(b.title);
            } else {
                comparison = a.id - b.id;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    } else if (order !== undefined) {
        return res.status(400).json({
            message: "Sıralama yönü kullanmak için sortBy parametresi gereklidir."
        });
    }

    // Sayfalama işlemi
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1
    ) {
        return res.status(400).json({
            message: "Sayfa ve limit pozitif tam sayı olmalıdır."
        });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    res.json({
        totalTasks: filteredTasks.length,
        currentPage: page,
        totalPages: Math.ceil(filteredTasks.length / limit),
        tasks: paginatedTasks
    });
};

// Görev raporlarını görüntüleme
const getTaskReport = (req, res) => {
    const tasks = readTasks();
    const report = generateTaskReport(tasks);

    res.json(report);
};

// Görev detayını görüntüleme
const getTaskById = (req, res) => {
    const taskId = validateTaskId(req, res);

    if (taskId === null) return;

    const tasks = readTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Görev bulunamadı"
        });
    }

    res.json(task);
};

// Görev ekleme
const createTask = (req, res) => {
    const tasks = readTasks();

    const {
        title,
        description,
        assignee,
        contributors,
        priority,
        completed
    } = req.body;

    const newTask = {
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        title,
        description,
        completed: completed ?? false,
        assignee: assignee ?? "Atanmamış",
        contributors: contributors ?? [],
        priority: priority ?? "medium"
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
};

// Görev güncelleme
const updateTask = (req, res) => {
    const taskId = validateTaskId(req, res);

    if (taskId === null) return;

    const tasks = readTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Görev bulunamadı"
        });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.completed = req.body.completed ?? task.completed;
    task.assignee = req.body.assignee ?? task.assignee;
    task.contributors = req.body.contributors ?? task.contributors;
    task.priority = req.body.priority ?? task.priority;

    writeTasks(tasks);

    res.json(task);
};

// Görev silme
const deleteTask = (req, res) => {
    const taskId = validateTaskId(req, res);

    if (taskId === null) return;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Görev bulunamadı"
        });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    res.json({
        message: "Görev başarıyla silindi"
    });
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskReport
};
