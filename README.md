# LOSH / SeoraAI

## تشغيل
```bash
cp .env.example .env.local
npm install
npm run dev
```

افتح `http://localhost:3000`.

## API
- `GET /v1/models`
- `POST /v1/chat/completions` — SSE
- `POST /v1/images/generations`
- `POST /v1/videos/generations`

## ملاحظات مهمة
لا توجد مفاتيح API حقيقية داخل المشروع. أضف `OPENAI_API_KEY` في `.env.local`.
`SEORAAI_API_KEY` هو مفتاح بوابة مشروعك، وليس مفتاح مزود خارجي.
واجهة الفيديو هنا Adapter آمن؛ اربط مزودًا حقيقيًا من الخادم حسب شروطه وحدوده.
