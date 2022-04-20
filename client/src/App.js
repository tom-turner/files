import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import Register from "./components/Register"
import FilePreview from "./components/FilePreview"
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/file:/*" element={ <FilePreview /> } />
      <Route path="/*" root element={ <FileExplorer /> } />
    </Routes>
  </BrowserRouter>
}

export default App;
