import React from "react";
import { Link } from "react-router-dom";

function ForbiddenPage() {
  return (
    <div>
      <h1>403</h1>
      <p>У вас нет доступа к этой странице.</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}

export default ForbiddenPage;