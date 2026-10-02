import React, { useState } from "react";
import { contentApi } from "../services/api";

const sections = [["news", "Новости"], ["reviews", "Отзывы"], ["vacancies", "Вакансии"]];
function readLegacy() {
  return sections.flatMap(([kind, title]) => {
    try {
      const raw = localStorage.getItem(`naramed-${kind}`);
      if (raw === null) return [];
      const items = JSON.parse(raw);
      if (!Array.isArray(items)) return [{ kind, title, error: "Сохранённые данные повреждены. Не удаляйте их из браузера." }];
      return [{ kind, title, items }];
    } catch { return [{ kind, title, error: "Не удалось прочитать данные из браузера." }]; }
  });
}

export default function LegacyContentImport() {
  const [collections] = useState(readLegacy);
  const [statuses, setStatuses] = useState({});
  const [busy, setBusy] = useState(false);
  if (!collections.length) return null;
  const transfer = async collection => {
    setBusy(true);
    try {
      await contentApi.import(collection.kind, collection.items);
      setStatuses(current => ({ ...current, [collection.kind]: { done: true, message: "Перенесено на сервер. Копия в браузере сохранена." } }));
      window.dispatchEvent(new Event("clinic-content-imported"));
    } catch (err) { setStatuses(current => ({ ...current, [collection.kind]: { message: err.message } })); }
    finally { setBusy(false); }
  };
  return <section className="legacy-content-import">
    <h2>Перенос старых данных</h2>
    <p>В этом браузере найдены записи прежней версии сайта. Перенесите их перед редактированием разделов, чтобы они стали доступны всем посетителям.</p>
    <p>Перенос заменит начальные записи выбранного раздела. Если на сервере уже есть правки, замена будет заблокирована. Копии в браузере останутся.</p>
    {collections.map(collection => <article key={collection.kind}>
      <h3>{collection.title}{collection.items && `: ${collection.items.length} записей`}</h3>
      {collection.items && <details><summary>Посмотреть список перед переносом</summary><ul>{collection.items.map((item, index) => <li key={index}>{item.title || item.name || `Запись ${index + 1}`}</li>)}</ul></details>}
      {collection.error ? <p role="alert">{collection.error}</p> : <button disabled={busy || statuses[collection.kind]?.done} onClick={() => transfer(collection)}>Перенести {collection.title.toLowerCase()}</button>}
      {statuses[collection.kind] && <p role="status">{statuses[collection.kind].message}</p>}
    </article>)}
  </section>;
}
