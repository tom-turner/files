import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import Register from "./components/Register"
import FilePreview from "./components/FilePreview"
import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";

function Explorer(cookies) {
  const params = useParams()

  return (
      <FileExplorer path={ params['*'] } />
  )
}

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/login" root element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/file:/*" element={ <FilePreview /> } />
      <Route path="/*" root element={ <Explorer /> } />
    </Routes>
  </BrowserRouter>
}

export default App;
