
# TASKFLOW – Görev ve Proje Yönetim Sistemi API

Node.js ve Express.js kullanılarak geliştirilmiş REST API tabanlı görev yönetim sistemi.

## Gereksinimler

- Node.js
- npm

## Kurulum

Projeyi bilgisayarınıza indirin veya GitHub deposunu klonlayın.

Proje klasörüne girin:

```bash
cd TASKFLOW
```

Bağımlılıkları yükleyin:

```bash
npm install
```

## Uygulamayı Çalıştırma

Sunucuyu başlatmak için:

```bash
npm start
```

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Uygulama varsayılan olarak aşağıdaki adreste çalışır:

http://localhost:3000

## Testleri Çalıştırma

Otomatik testleri çalıştırmak için:

```bash
npm test
```

Testler Jest ve Supertest kullanılarak hazırlanmıştır.

## API Endpointleri

| HTTP Metodu | Endpoint | Açıklama |
|---|---|---|
| GET | /tasks | Görevleri listeler. |
| GET | /tasks/:id | Görev detayını getirir. |
| POST | /tasks | Yeni görev oluşturur. |
| PUT | /tasks/:id | Görevi günceller. |
| DELETE | /tasks/:id | Görevi siler. |
| GET | /tasks/report | Görev raporlarını getirir. |

## Veri Saklama

Görev verileri `data/tasks.json` dosyasında JSON formatında saklanır.

Yeni görev oluşturma, güncelleme ve silme işlemleri dosya üzerinde kalıcı olarak tutulur.

## Ek API Özellikleri

- Görev arama
- Önceliğe göre filtreleme
- Görevleri sıralama
- Sayfalama
- Veri doğrulama
- Görev raporlama

## Kullanılan Teknolojiler

- Node.js
- Express.js
- JavaScript
- Jest
- Supertest
- Postman
