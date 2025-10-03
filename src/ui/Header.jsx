import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Drag & Drop To-Do Board
      </h1>
      <ThemeToggle />
    </div>
  );
}

export default Header;
