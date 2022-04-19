import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import Register from "./components/Register"
import FilePreview from "./components/FilePreview"
import ServerCheck from "./components/ServerCheck"

import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";

function Explorer() {
  const params = useParams()
  return (
      <FileExplorer path={ params['*'] } />
  )
}

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
          <Route path="/file:/*" element={ <FilePreview /> } />
          <Route path="/*" root element={ <Explorer /> } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
