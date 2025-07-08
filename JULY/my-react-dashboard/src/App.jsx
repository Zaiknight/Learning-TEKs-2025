import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import Login from "./routes/Login.jsx";
import Signup from "./routes/Signup.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import UsersList from "./routes/user.jsx";
import ToDoList from "./routes/ToDo.jsx";
import QuizForm from "./routes/QuizForm.jsx";
import Quiz from "./routes/Quiz.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/to-do-list" element={<ToDoList />}/>
          <Route path="/quiz_form" element={<QuizForm/>} />
          <Route path="/quiz" element={<Quiz/>} />
        </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
