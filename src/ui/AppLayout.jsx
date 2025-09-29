import Header from './Header';
import Heading from './Heading';
import TaskList from './TaskList';
import Column from './Column';
import TestDraDroppaleContainer from './TestDraDroppaleContainer';

function AppLayout() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-gray-800 bg-gray-200">
      <Header />
      {/* <TestDraDroppaleContainer /> */}
      <Column />

      {/* <main className="w-full h-screen grid grid-rows-[40px_1fr] grid-cols-3 gap-4 p-3 text-center">
        <Heading>To Do</Heading>
        <Heading>In Progress</Heading>
        <Heading>Completed</Heading>

        <TaskList />

        <h3 className="text-2xl bg-amber-200">Welcome to Task Manager</h3>
        <Column />
        <h3 className="text-2xl">Welcome to Task Manager</h3>
      </main> */}
    </div>
  );
}

export default AppLayout;
