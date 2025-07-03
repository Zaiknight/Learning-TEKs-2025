import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./routes/Login.jsx";
import Signup from "./routes/Signup.jsx";
import Dashboard from "./routes/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>  {/* Enables routing */}
      <Routes>
        <Route path="/" element={<Login/>}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
