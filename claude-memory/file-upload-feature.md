# File Upload Feature — Web3Forms

## Что хочет пользователь
Добавить на сайт возможность загружать картинки (фото документов/машины/водителя) и отправлять их на email `contact@mikesdelivery.org` через Web3Forms.

## Ответ: ДА, Web3Forms это поддерживает

## Лимиты Web3Forms
| Тариф | Файлы | Размер |
|---|---|---|
| **Free** (текущий) | 1 файл за отправку | до **5 МБ** |
| **Pro** ($2/мес) | несколько файлов | до 60 МБ |

Для фото с телефона 5 МБ обычно достаточно (камеры дают 2-4 МБ JPG).

## Технические детали реализации

### HTML поле
```html
<input type="file" name="attachment" accept="image/*">
```
- Имя поля **СТРОГО `attachment`** — иначе Web3Forms не поймёт, что это файл.
- `accept="image/*"` — ограничивает выбор только картинками на уровне браузера.

### Изменения в отправке (index.html строка ~1513)
Сейчас форма отправляет JSON:
```js
const response = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Accept: 'application/json'},
  body: JSON.stringify({...})
});
```

Надо переключить на **FormData** (browser сам выставит multipart content-type с boundary):
```js
const formData = new FormData(form);
formData.append('access_key', '1e9c640d-e1a1-4c95-a548-4aec5ae893bd');
// НЕ добавлять headers или Content-Type!
const response = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  body: formData
});
```

### Валидация (клиентская)
```js
const file = document.getElementById('attachment').files[0];
if (file && file.size > 5 * 1024 * 1024) {
  alert('Файл больше 5 МБ. Уменьшите размер или выберите другое фото.');
  return;
}
if (file && !file.type.startsWith('image/')) {
  alert('Можно загружать только изображения.');
  return;
}
```

## План реализации (когда пользователь подтвердит)
1. Уточнить у пользователя:
   - Какие фото собирать (CDL / машина / водитель / другое)?
   - Сколько полей загрузки (одно или несколько)?
   - Обязательное или нет?
2. Добавить `<input type="file" name="attachment" accept="image/*">` в форму после Phone.
3. Добавить превью загруженной картинки (опционально, UX).
4. Изменить JS-отправку на FormData.
5. Добавить валидацию размера/типа с понятными сообщениями.
6. Протестировать через Playwright (хотя загрузка файла в headless сложнее).
7. Обновить memory после реализации.

## Документация Web3Forms
- https://docs.web3forms.com/getting-started/examples/file-upload-form
- https://docs.web3forms.com/getting-started/pro-features/file-attachments

## Замечание
Если пользователь захочет несколько фото бесплатно — можно сделать **несколько полей `<input type="file">`** каждый со своим `name` (attachment, attachment2, ...) — но это требует тестирования, бесплатно ли Web3Forms примет несколько полей. По докам бесплатно только 1 файл за раз.
