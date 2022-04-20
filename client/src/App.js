import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import Register from "./components/Register"
import FilePreview from "./components/FilePreview"
import useStickyState from "./lib/useStickyState"
import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";

function Explorer(cookies) {
  const params = useParams()
  return (
      <FileExplorer path={ params['*'] } />
  )
}

function App() {
  let [ auth, setAuth ] = useStickyState(true)

  if(auth){
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/file:/*" element={ <FilePreview /> } />
            <Route path="/*" root element={ <Explorer /> } />
          </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/login" root element={ <Login /> } />
            <Route path="/register" element={ <Register /> } />
            <Route path="/*" element={ <Login /> } />
          </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
