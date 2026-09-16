import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/LegalDocs.css";

function LegalDocs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="legal-section-title">
      <h1 className="legal-siteTitle">
        <Link to="/">НАРАМЕД <span className="legal-siteSign">+</span></Link>
      </h1>

      <div className="legal-text-content">
        <p className="legal-kicker">ОФИЦИАЛЬНАЯ ИНФОРМАЦИЯ</p>
        <h2 className="legal-page-heading">Правовая информация</h2>

        <p className="legal-title">Общие положения</p>
        <p className="legal-description">
          Настоящий сайт является официальным информационным ресурсом клиники
          «Нарамед». Размещённые материалы предназначены для ознакомления с
          услугами клиники, специалистами, графиком работы и способами записи
          на приём.
        </p>

        <p className="legal-title">Защита материалов</p>
        <p className="legal-description">
          Сайт, его оформление, тексты, фотографии, фирменные элементы и другие
          материалы защищены клиникой «Нарамед». Копирование, публикация или
          коммерческое использование материалов без предварительного письменного
          разрешения правообладателя не допускается.
        </p>

        <p className="legal-title">Конфиденциальность</p>
        <p className="legal-description">
          Информация, которую посетитель добровольно передаёт через формы записи
          и связи, используется только для обработки обращения и организации
          медицинского приёма. Клиника принимает необходимые меры для защиты
          персональных данных от неправомерного доступа.
        </p>

        <p className="legal-title">Медицинская информация</p>
        <p className="legal-description">
          Информация на сайте не заменяет очную консультацию врача и не должна
          использоваться для самостоятельной постановки диагноза или назначения
          лечения. При экстренной ситуации необходимо обратиться в службу
          скорой медицинской помощи.
        </p>

        <p className="legal-title">Разработка сайта</p>
        <p className="legal-description">
          Разработчик сайта — <strong>Муса Тасбаев</strong>. Техническая
          реализация, структура и пользовательский интерфейс созданы специально
          для клиники «Нарамед».
        </p>
      </div>

      <div className="legal-footer">
        <p>© 2026 Клиника «Нарамед». Все права защищены.</p>
        <p className="legal-developer">Разработчик сайта: <strong>Муса Тасбаев</strong></p>
        <Link to="/">← Вернуться на главную</Link>
      </div>
    </div>
  );
}

export default LegalDocs;
