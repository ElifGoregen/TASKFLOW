

const request = require("supertest");
const fs = require("fs");
const path = require("path");

let app;

// Başlangıç görevleri
const initialTasks = [
    {
        id: 1,
        title: "Proje analizini yap",
        description: "TASKFLOW gereksinimlerini incele",
        completed: false,
        assignee: "Atanmamış",
        contributors: [],
        priority: "high"
    },
    {
        id: 2,
        title: "Backend geliştirme",
        description: "Express.js ile API oluştur",
        completed: false,
        assignee: "Atanmamış",
        contributors: [],
        priority: "medium"
    }
];

// JSON dosyasının yolu
const tasksFilePath = path.join(__dirname, "../data/tasks.json");

describe("TASKFLOW API Testleri", () => {

    // Her test öncesinde görev verilerini sıfırla
    beforeEach(() => {
        fs.writeFileSync(
            tasksFilePath,
            JSON.stringify(initialTasks, null, 2),
            "utf8"
        );

        jest.resetModules();
        app = require("../app");
    });

    // Her test sonrasında JSON dosyasını temizle
    afterEach(() => {
        fs.writeFileSync(
            tasksFilePath,
            JSON.stringify(initialTasks, null, 2),
            "utf8"
        );
    });


    // GET - Görevleri listeleme
    test("Görevleri listeleme - GET /tasks", async () => {

        const response = await request(app).get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tasks");
        expect(Array.isArray(response.body.tasks)).toBe(true);

    });

    // POST - Yeni görev oluşturma
    test("Yeni görev oluşturma - POST /tasks", async () => {

        const newTask = {
            title: "Otomatik test görevi",
            description: "Jest ve Supertest ile test",
            assignee: "Elif",
            contributors: ["Elif"],
            priority: "high"
        };

        const response = await request(app)
            .post("/tasks")
            .send(newTask);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe(newTask.title);

    });

    // PUT - Görev güncelleme
    test("Görev güncelleme - PUT /tasks/:id", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Güncellenecek görev",
                description: "İlk açıklama",
                priority: "low",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        const taskId = createResponse.body.id;

        const updateResponse = await request(app)
            .put(`/tasks/${taskId}`)
            .send({
                title: "Güncellenmiş görev",
                description: "Yeni açıklama",
                priority: "high",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toBe("Güncellenmiş görev");
        expect(updateResponse.body.priority).toBe("high");

    });

    // DELETE - Görev silme
    test("Görev silme - DELETE /tasks/:id", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Silinecek görev",
                description: "DELETE testi",
                priority: "medium",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        const taskId = createResponse.body.id;

        const deleteResponse = await request(app)
            .delete(`/tasks/${taskId}`);

        expect(deleteResponse.status).toBe(200);

        const getResponse = await request(app)
            .get(`/tasks/${taskId}`);

        expect(getResponse.status).toBe(404);

    });

    // VALIDATION - Başlık boş gönderildiğinde
    test("Boş başlık gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "",
                description: "Test açıklaması",
                priority: "medium",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        expect(response.status).toBe(400);

    });

    // VALIDATION - Açıklama boş gönderildiğinde
    test("Boş açıklama gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Test görevi",
                description: "",
                priority: "medium",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        expect(response.status).toBe(400);

    });

    // VALIDATION - Geçersiz öncelik gönderildiğinde
    test("Geçersiz öncelik gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Test görevi",
                description: "Test açıklaması",
                priority: "urgent",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        expect(response.status).toBe(400);

    });

    // REPORT - Görev raporlarını kontrol etme
    test("Görev raporları doğru şekilde oluşturulmalı", async () => {

        const response = await request(app).get("/tasks/report");

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("totalTasks");
        expect(response.body).toHaveProperty("completedTasks");
        expect(response.body).toHaveProperty("pendingTasks");
        expect(response.body).toHaveProperty("priorityDistribution");
        expect(response.body).toHaveProperty("assigneeDistribution");
        expect(response.body).toHaveProperty("contributorDistribution");

        expect(typeof response.body.totalTasks).toBe("number");
        expect(typeof response.body.completedTasks).toBe("number");
        expect(typeof response.body.pendingTasks).toBe("number");

    });

    // 404 - Olmayan görevi getirme
    test("Olmayan görev istendiğinde 404 dönmeli", async () => {

        const response = await request(app).get("/tasks/999999");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");

    });

    // 404 - Olmayan görevi güncelleme
    test("Olmayan görev güncellenmek istendiğinde 404 dönmeli", async () => {

        const response = await request(app)
            .put("/tasks/999999")
            .send({
                title: "Yeni başlık",
                description: "Yeni açıklama",
                priority: "high",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");

    });

    // 404 - Olmayan görevi silme
    test("Olmayan görev silinmek istendiğinde 404 dönmeli", async () => {

        const response = await request(app).delete("/tasks/999999");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");

    });

    // ERROR HANDLING - Hatalı JSON kontrolü
    test("Hatalı JSON gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .set("Content-Type", "application/json")
            .send('{"title": "Test görevi", "description":');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Geçersiz JSON formatı.");

    });

    // PAGINATION - Sayfalama kontrolü
    test("Görevler sayfalara doğru şekilde bölünmeli", async () => {

        const response = await request(app)
            .get("/tasks?page=1&limit=1");

        expect(response.status).toBe(200);
        expect(response.body.currentPage).toBe(1);
        expect(response.body.tasks).toHaveLength(1);
        expect(response.body.totalPages).toBeGreaterThanOrEqual(1);

    });

    // SEARCH - Görev arama kontrolü
    test("Görevler arama parametresine göre filtrelenmeli", async () => {

        const searchTitle = "Otomatik test görevi";

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: searchTitle,
                description: "Jest arama testi",
                priority: "high"
            });

        expect(createResponse.status).toBe(201);

        const response = await request(app)
            .get(`/tasks?search=${encodeURIComponent(searchTitle)}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tasks");

        expect(
            response.body.tasks.some(task =>
                task.title.includes(searchTitle)
            )
        ).toBe(true);

    });

    // FILTER - Önceliğe göre görev filtreleme
    test("Görevler öncelik seviyesine göre filtrelenmeli", async () => {

        const response = await request(app)
            .get("/tasks?priority=high");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tasks");

        expect(response.body.tasks.length).toBeGreaterThan(0);

        response.body.tasks.forEach(task => {
            expect(task.priority).toBe("high");
        });

    });

    // PAGINATION VALIDATION - Geçersiz sayfa numarası
    test("Sıfır sayfa numarası gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .get("/tasks?page=0");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Sayfa ve limit pozitif tam sayı olmalıdır."
        );

    });

    // PAGINATION VALIDATION - Negatif limit
    test("Negatif limit gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .get("/tasks?limit=-1");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Sayfa ve limit pozitif tam sayı olmalıdır."
        );

    });

    // PAGINATION VALIDATION - Ondalıklı sayfa numarası
    test("Ondalıklı sayfa numarası gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .get("/tasks?page=1.5");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Sayfa ve limit pozitif tam sayı olmalıdır."
        );

    });

    // SORT - Önceliğe göre artan sıralama
    test("Görevler önceliğe göre artan sıralanmalı", async () => {

        const response = await request(app)
            .get("/tasks?sortBy=priority&order=asc&limit=100");

        expect(response.status).toBe(200);

        const priorityOrder = {
            low: 1,
            medium: 2,
            high: 3
        };

        const priorities = response.body.tasks.map(
            task => priorityOrder[task.priority]
        );

        for (let i = 0; i < priorities.length - 1; i++) {
            expect(priorities[i]).toBeLessThanOrEqual(priorities[i + 1]);
        }

    });

    // SORT - Önceliğe göre azalan sıralama
    test("Görevler önceliğe göre azalan sıralanmalı", async () => {

        const response = await request(app)
            .get("/tasks?sortBy=priority&order=desc&limit=100");

        expect(response.status).toBe(200);

        const priorityOrder = {
            low: 1,
            medium: 2,
            high: 3
        };

        const priorities = response.body.tasks.map(
            task => priorityOrder[task.priority]
        );

        for (let i = 0; i < priorities.length - 1; i++) {
            expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i + 1]);
        }

    });

    // FILTER - Tamamlanmış görevlere göre filtreleme
    test("Tamamlanmış görevler doğru şekilde filtrelenmeli", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Tamamlanmış test görevi",
                description: "Completed filtreleme testi",
                priority: "high",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        const taskId = createResponse.body.id;

        const updateResponse = await request(app)
            .put(`/tasks/${taskId}`)
            .send({
                completed: true
            });

        expect(updateResponse.status).toBe(200);

        const response = await request(app)
            .get("/tasks?completed=true&limit=100");

        expect(response.status).toBe(200);

        const foundTask = response.body.tasks.find(
            task => task.id === taskId
        );

        expect(foundTask).toBeDefined();
        expect(foundTask.completed).toBe(true);

    });

    // FILTER - Sorumlu kişiye göre filtreleme
    test("Görevler sorumlu kişiye göre filtrelenmeli", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Assignee test görevi",
                description: "Sorumlu kişi filtreleme testi",
                priority: "medium",
                assignee: "Elif",
                contributors: []
            });

        expect(createResponse.status).toBe(201);

        const response = await request(app)
            .get("/tasks?assignee=Elif&limit=100");

        expect(response.status).toBe(200);

        const foundTask = response.body.tasks.find(
            task => task.id === createResponse.body.id
        );

        expect(foundTask).toBeDefined();
        expect(foundTask.assignee).toBe("Elif");

    });

    // FILTER - Katkıda bulunan kişiye göre filtreleme
    test("Görevler katkıda bulunan kişiye göre filtrelenmeli", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Contributor test görevi",
                description: "Katkıda bulunan kişi filtreleme testi",
                priority: "medium",
                assignee: "Mehmet",
                contributors: ["Elif", "Ayşe"]
            });

        expect(createResponse.status).toBe(201);

        const response = await request(app)
            .get("/tasks?contributor=Elif&limit=100");

        expect(response.status).toBe(200);

        const foundTask = response.body.tasks.find(
            task => task.id === createResponse.body.id
        );

        expect(foundTask).toBeDefined();
        expect(foundTask.contributors).toContain("Elif");

    });

    // SORT VALIDATION - Geçersiz sıralama alanı
    test("Geçersiz sıralama alanı gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .get("/tasks?sortBy=invalid");

        expect(response.status).toBe(400);

    });

    // SORT VALIDATION - Geçersiz sıralama yönü
    test("Geçersiz sıralama yönü gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .get("/tasks?sortBy=priority&order=invalid");

        expect(response.status).toBe(400);

    });

    // VALIDATION - Boş güncelleme kontrolü
    test("Boş güncelleme isteğinde 400 dönmeli", async () => {

        const response = await request(app)
            .put("/tasks/1")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Güncelleme için en az bir alan gönderilmelidir."
        );

    });

    // VALIDATION - Contributors dizi kontrolü
    test("Contributors dizi dışında gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Test görevi",
                description: "Contributors doğrulama testi",
                priority: "medium",
                contributors: "Elif"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Contributors bir dizi olmalıdır."
        );

    });

    // VALIDATION - Completed veri tipi kontrolü
    test("Completed değeri boolean dışında gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Test görevi",
                description: "Completed doğrulama testi",
                priority: "medium",
                completed: "true"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Completed değeri true veya false olmalıdır."
        );

    });

    // VALIDATION - Assignee kontrolü
    test("Assignee boş gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Test görevi",
                description: "Assignee doğrulama testi",
                priority: "medium",
                assignee: "   "
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Sorumlu çalışan adı geçerli olmalıdır."
        );

    });

    // SEARCH VALIDATION - Boş arama parametresi
    test("Boş arama parametresi gönderildiğinde 400 dönmeli", async () => {

        const response = await request(app)
            .get("/tasks?search=%20%20%20");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Arama parametresi boş olamaz."
        );

    });

    // REPORT - Görev sayılarının doğru hesaplanması
    test("Görev raporları doğru sayısal değerler döndürmeli", async () => {

        const createResponse = await request(app)
            .post("/tasks")
            .send({
                title: "Raporlama test görevi",
                description: "Raporlama hesaplama kontrolü",
                priority: "high",
                assignee: "Elif",
                contributors: ["Elif"]
            });

        expect(createResponse.status).toBe(201);

        const taskId = createResponse.body.id;

        const updateResponse = await request(app)
            .put(`/tasks/${taskId}`)
            .send({
                completed: true
            });

        expect(updateResponse.status).toBe(200);

        const response = await request(app).get("/tasks/report");

        expect(response.status).toBe(200);
        expect(response.body.totalTasks).toBe(3);
        expect(response.body.completedTasks).toBe(1);
        expect(response.body.pendingTasks).toBe(2);
        expect(response.body.priorityDistribution.high).toBe(2);
        expect(response.body.assigneeDistribution.Elif).toBe(1);

    });

});
