import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import Register from "./components/Register"
import FilePreview from "./components/FilePreview"
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import {withAuthentication} from "./lib/withAuthentication";

const AuthenticatedOutlet = withAuthentication(Outlet)

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />

      <Route element={ <AuthenticatedOutlet />}>
        <Route path="/file:/*" element={ <FilePreview /> } />
        <Route path="/*" root element={ <FileExplorer /> } />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App;
