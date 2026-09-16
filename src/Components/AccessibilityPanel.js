import React, { useEffect, useState } from "react";
import { Eye, ImageOff, RotateCcw, X } from "lucide-react";

const STORAGE_KEY = "naramed-accessibility";
const defaultSettings = { enabled: false, fontSize: "medium", contrast: "normal", hideImages: false };

function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
    catch { return defaultSettings; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-enabled", settings.enabled);
    root.classList.toggle("a11y-hide-images", settings.enabled && settings.hideImages);
    root.dataset.a11yFont = settings.enabled ? settings.fontSize : "";
    root.dataset.a11yContrast = settings.enabled ? settings.contrast : "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return () => {
      root.classList.remove("a11y-enabled", "a11y-hide-images");
      delete root.dataset.a11yFont;
      delete root.dataset.a11yContrast;
    };
  }, [settings]);

  const enable = () => {
    setSettings((current) => ({ ...current, enabled: true }));
    setOpen(true);
  };
  const reset = () => setSettings(defaultSettings);

  return <>
    <button className="accessibility-trigger" type="button" onClick={enable} aria-label="Открыть версию для слабовидящих" aria-expanded={open}>
      <Eye size={22}/><span>Версия для слабовидящих</span>
    </button>

    {open && <div className="accessibility-panel" role="dialog" aria-label="Настройки версии для слабовидящих">
      <header><div><Eye size={22}/><b>Версия для слабовидящих</b></div><button type="button" onClick={() => setOpen(false)} aria-label="Закрыть"><X/></button></header>

      <fieldset>
        <legend>Размер текста</legend>
        <div className="a11y-options font-options">
          {[["medium", "A", "Обычный"], ["large", "A", "Крупный"], ["xlarge", "A", "Очень крупный"]].map(([value, letter, label], index) =>
            <button type="button" key={value} className={settings.fontSize === value ? "selected" : ""} onClick={() => setSettings({ ...settings, enabled: true, fontSize: value })}>
              <span style={{ fontSize: `${16 + index * 5}px` }}>{letter}</span><small>{label}</small>
            </button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend>Цвет сайта</legend>
        <div className="a11y-options contrast-options">
          {[["normal", "Белый", "Aa"], ["black", "Чёрный", "Aa"], ["yellow", "Жёлтый", "Aa"]].map(([value, label, sample]) =>
            <button type="button" key={value} className={`${value} ${settings.contrast === value ? "selected" : ""}`} onClick={() => setSettings({ ...settings, enabled: true, contrast: value })}>
              <span>{sample}</span><small>{label}</small>
            </button>)}
        </div>
      </fieldset>

      <label className="a11y-switch"><span><ImageOff size={19}/><span><b>Скрыть изображения</b><small>Оставить только текст</small></span></span><input type="checkbox" checked={settings.hideImages} onChange={(e) => setSettings({ ...settings, enabled: true, hideImages: e.target.checked })}/><i/></label>

      <div className="a11y-panel-actions">
        <button type="button" onClick={reset}><RotateCcw size={17}/> Обычная версия</button>
        <button type="button" className="a11y-done" onClick={() => setOpen(false)}>Готово</button>
      </div>
    </div>}
  </>;
}

export default AccessibilityPanel;
