
const generateTaskReport = (tasks) => {

    // Gelen verinin dizi olup olmadığını kontrol et
    if (!Array.isArray(tasks)) {
        throw new TypeError("Tasks bir dizi olmalıdır.");
    }

    // Toplam görev sayısı
    const totalTasks = tasks.length;

    // Tamamlanan görevler
    const completedTasks = tasks.filter(
        task => task?.completed === true
    ).length;

    // Bekleyen görevler
    const pendingTasks = totalTasks - completedTasks;

    // Önceliklere göre görev dağılımı
    const priorityDistribution = {
        low: tasks.filter(
            task => task?.priority === "low"
        ).length,

        medium: tasks.filter(
            task => task?.priority === "medium"
        ).length,

        high: tasks.filter(
            task => task?.priority === "high"
        ).length
    };

    // Sorumlu çalışanlara göre görev dağılımı
    const assigneeDistribution = {};

    tasks.forEach(task => {
        const assignee = task?.assignee || "Atanmamış";

        assigneeDistribution[assignee] =
            (assigneeDistribution[assignee] || 0) + 1;
    });

    // Katkıda bulunan çalışanlara göre dağılım
    const contributorDistribution = {};

    tasks.forEach(task => {

        // Contributors alanının dizi olduğunu kontrol et
        if (!Array.isArray(task?.contributors)) {
            return;
        }

        task.contributors.forEach(contributor => {

            // Boş veya geçersiz isimleri atla
            if (
                typeof contributor !== "string" ||
                !contributor.trim()
            ) {
                return;
            }

            const contributorName = contributor.trim();

            contributorDistribution[contributorName] =
                (contributorDistribution[contributorName] || 0) + 1;
        });
    });

    // Raporu döndür
    return {
        totalTasks,
        completedTasks,
        pendingTasks,
        priorityDistribution,
        assigneeDistribution,
        contributorDistribution
    };
};

module.exports = {
    generateTaskReport
};
