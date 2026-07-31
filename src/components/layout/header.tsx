import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { REPO_NAME } from "../../utils/config";

const Header = ({
  setNavbarOpen,
  navbarOpen,
}: {
  setNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navbarOpen: boolean;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const scrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg- border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={`${REPO_NAME}/ras_logo_black.png`}
              alt="RAS Uniandes"
              className="w-8 h-8"
            />
            <div className="hidden md:block">
              <p className="text-gray-900 dark:text-white font-semibold">
                RAS Uniandes
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                IEEE Robotics &amp; Automation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#nosotros"
              onClick={scrollTo("nosotros")}
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Nosotros
            </a>
            <Link
              to="/swarm-project"
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Proyecto
            </Link>
            <a
              href="#charlas"
              onClick={scrollTo("charlas")}
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Charlas
            </a>
            <a
              href="#spark"
              onClick={scrollTo("spark")}
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Robot Spark
            </a>
            <a
              href="#aliados"
              onClick={scrollTo("aliados")}
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Aliados
            </a>
            <Link
              to="/equipo"
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Equipo
            </Link>
            <Link
              to="/tools"
              className="text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition"
            >
              Herramientas
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Cambiar tema"
              onClick={handleThemeToggle}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-900 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900 dark:text-gray-300" />
              )}
            </button>

            {/* CTA Button */}
            <a
              href="mailto:rasuniandes@uniandes.edu.co"
              className="hidden md:inline-flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition gap-2"
            >
              Trabajemos juntos <span>→</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              {navbarOpen ? (
                <X className="w-5 h-5 text-gray-900 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-900 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;