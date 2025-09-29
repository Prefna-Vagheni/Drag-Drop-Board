import { useState } from 'react';
import { HiPlus, HiUser } from 'react-icons/hi';
import Form from './Form';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <ul className="w-full flex justify-between items-center p-3 bg-gray-100 border-b border-gray-300">
        <li className="text-4xl font-bold  mb-10">Task-manager</li>
        <li className="text-lg flex items-center">
          <button
            className="cursor-pointer flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={handleClick}
          >
            <span>
              <HiPlus />
            </span>
            Add Task
          </button>
          <HiUser className="inline text-3xl ml-4 cursor-pointer" />
        </li>
        {isOpen && <Form setIsOpen={setIsOpen} />}
      </ul>
    </>
  );
}

export default Header;
