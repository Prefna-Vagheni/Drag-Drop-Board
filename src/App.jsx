import { TaskProvider } from './context/TasksContext';
import AppLayout from './ui/AppLayout';
// import './App.css';

function App() {
  return (
    <TaskProvider>
      <AppLayout />
    </TaskProvider>
  );
}

export default App;
