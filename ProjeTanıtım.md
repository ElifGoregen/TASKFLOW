# TASKFLOW
## Görev ve Proje Yönetim Sistemi – Proje Tanıtım Dokümanı

### 1. Projenin Amacı ve Kapsamı

TASKFLOW, yazılım ekiplerinin görevlerini merkezi bir sistem üzerinden oluşturmasını, düzenlemesini, çalışanlara atamasını ve görev süreçlerini takip etmesini sağlayan REST API tabanlı bir görev yönetim sistemidir.

Projenin temel amacı, ekiplerin iş takibini kolaylaştırmak, görevlerin durumlarını kontrol altında tutmak ve görev yönetimi süreçlerini daha düzenli hâle getirmektir.

Sistem üzerinden kullanıcılar yeni görevler oluşturabilir, mevcut görevleri görüntüleyebilir, güncelleyebilir ve silebilir. Ayrıca görevler öncelik, tamamlanma durumu ve atanan kişi gibi özelliklere göre yönetilebilir.

TASKFLOW, backend geliştirme prensipleri dikkate alınarak modüler ve sürdürülebilir bir yapıda geliştirilmiştir.

### 2. Kullanılan Teknolojiler

Projenin geliştirilmesinde aşağıdaki teknolojiler ve araçlar kullanılmıştır:

- **Node.js:** Sunucu tarafında JavaScript çalıştırmak için kullanılmıştır.
- **Express.js:** REST API endpointlerinin oluşturulmasını ve HTTP isteklerinin yönetilmesini sağlamıştır.
- **JavaScript:** Uygulamanın temel programlama dili olarak kullanılmıştır.
- **Jest:** Otomatik testlerin hazırlanması ve çalıştırılması için kullanılmıştır.
- **Supertest:** API endpointlerinin HTTP istekleri üzerinden test edilmesini sağlamıştır.
- **Postman:** API endpointlerinin manuel olarak test edilmesinde kullanılmıştır.
- **JSON:** Görev verilerinin dosya tabanlı olarak saklanmasında kullanılmıştır.

### 3. Sistem Mimarisi

TASKFLOW, kodun farklı sorumluluklara ayrıldığı modüler bir mimariyle geliştirilmiştir.

Proje içerisinde temel olarak aşağıdaki yapılar bulunmaktadır:

- **app.js:** Express uygulamasının başlatılmasını, middleware bağlantılarını ve route tanımlamalarını yönetir.
- **Routes:** Gelen HTTP isteklerini ilgili controller fonksiyonlarına yönlendirir.
- **Controllers:** API isteklerini karşılar, gerekli işlemleri gerçekleştirir ve istemciye uygun HTTP yanıtlarını döndürür.
- **Middleware:** İsteklerin kontrol edilmesi, veri doğrulama ve istek kayıtlarının tutulması gibi işlemleri gerçekleştirir.
- **Services:** Görev raporlama ve veri işlemleri gibi iş mantığına ait sorumlulukları yönetir.
- **data/tasks.json:** Görev bilgilerinin kalıcı olarak saklandığı JSON dosyasıdır.

Bu yapı sayesinde uygulamanın farklı bölümleri birbirinden ayrılmış, kodun okunabilirliği ve geliştirilebilirliği artırılmıştır.

### 4. Veri Modeli

Sistemde görevler aşağıdaki alanlardan oluşmaktadır:

| Alan | Açıklama |
|---|---|
| id | Görevin benzersiz kimliği |
| title | Görev başlığı |
| description | Görev açıklaması |
| completed | Görevin tamamlanma durumu |
| assignee | Görevin atandığı kişi |
| contributors | Göreve katkı sağlayan kişiler |
| priority | Görevin öncelik seviyesi |

Görev verileri JSON formatında tutulmaktadır. Yeni görev oluşturma, güncelleme ve silme işlemleri sonrasında veriler `data/tasks.json` dosyasına kaydedilmektedir.

### 5. API Özellikleri ve Endpointler

TASKFLOW, görev yönetimi işlemlerini REST API prensiplerine uygun HTTP metotları üzerinden gerçekleştirir.

| HTTP Metodu | Endpoint | Açıklama |
|---|---|---|
| GET | /tasks | Sistemdeki görevleri listeler. |
| GET | /tasks/:id | Belirtilen ID değerine sahip görevin detaylarını getirir. |
| POST | /tasks | Sisteme yeni bir görev ekler. |
| PUT | /tasks/:id | Belirtilen görevin bilgilerini günceller. |
| DELETE | /tasks/:id | Belirtilen görevi sistemden siler. |
| GET | /tasks/report | Görevlerle ilgili rapor bilgilerini getirir. |

Bunlara ek olarak sistemde görev arama, önceliğe göre filtreleme, sıralama ve sayfalama gibi özellikler bulunmaktadır.

### 6. Middleware ve Hata Yönetimi

Uygulamada HTTP isteklerinin daha kontrollü yönetilebilmesi amacıyla middleware yapısı kullanılmıştır.

- **Logger Middleware:** Gelen isteklerin bilgilerini konsola kaydeder.
- **Validation Middleware:** Görev oluşturma ve güncelleme işlemlerinde gönderilen verilerin uygunluğunu kontrol eder.
- **Express JSON Middleware:** İstek gövdelerinde gönderilen JSON verilerinin okunmasını sağlar.
- **404 Hata Yönetimi:** Sistemde tanımlı olmayan endpointlere yapılan isteklerde uygun hata yanıtı döndürür.

API yanıtlarında HTTP durum kodları kullanılarak işlemin sonucu istemciye bildirilir.

### 7. Test Süreci ve Sonuçları

Projenin doğruluğunu ve API işlemlerinin beklenen şekilde çalıştığını kontrol etmek amacıyla Jest ve Supertest kullanılarak otomatik testler hazırlanmıştır.

Test sürecinde görev listeleme, görev detayını görüntüleme, yeni görev oluşturma, görev güncelleme, görev silme ve hatalı isteklerin kontrolü gibi temel senaryolar ele alınmıştır.

Son gerçekleştirilen test çalıştırmasında aşağıdaki sonuçlar elde edilmiştir:

- Test Suites: 1 passed, 1 total
- Tests: 31 passed, 31 total
- Snapshots: 0 total

Ayrıca API endpointleri Postman üzerinden manuel olarak da kontrol edilmiştir.

### 8. Sonuç

TASKFLOW projesi kapsamında Node.js ve Express.js kullanılarak görev yönetimine yönelik bir REST API geliştirilmiştir.

Proje sürecinde REST API tasarımı, HTTP metotları ve durum kodları, middleware kullanımı, modüler yazılım mimarisi, JSON dosyası üzerinden veri saklama ve otomatik API testleri gibi backend geliştirme konularında uygulamalı çalışma gerçekleştirilmiştir.

TASKFLOW, temel görev yönetimi ihtiyaçlarını karşılayan ve geliştirilmeye açık bir backend uygulaması olarak tasarlanmıştır.