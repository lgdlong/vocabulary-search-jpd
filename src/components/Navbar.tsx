import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 sticky-top w-100">
      <div className="container-fluid px-3">
        {/* Logo bên trái */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-book me-2"></i>
          Japanese Vocabulary
        </Link>

        {/* Nút toggle cho mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Phần menu (ẩn trên mobile, hiện khi toggle mở) */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Home link: chỉ hiện trên mobile */}
            <li className="nav-item d-lg-none">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>

            {/* Dev Page link: luôn hiện trên PC, hiện trong toggle trên mobile */}
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/dev" ? "active" : ""
                }`}
                to="/dev"
              >
                <i className="bi bi-gear me-1"></i>
                Dev Page
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
