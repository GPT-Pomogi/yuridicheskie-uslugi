# Лендинг юридических услуг

Статический лендинг для услуги банкротства физических лиц.

## Что важно заменить перед продакшеном

- `https://t.me/your_lawyer` в `index.html` на реальный Telegram.
- `https://wa.me/79990000000` в `index.html` на реальный WhatsApp.
- `https://yuridicheskie-uslugi.vercel.app/` в `sitemap.xml`, если итоговый домен Vercel будет другим.
- Обработчик формы в `script.js` на Vercel Function, CRM, Telegram bot или другой безопасный backend.

## Локальный просмотр

Откройте `index.html` в браузере или запустите любой статический сервер в корне проекта.
