import { FileExplorer } from "./components/FileExplorer/FileExplorer"
import { SharedFileExplorer } from "./components/FileExplorer/SharedFileExplorer"
import { FilePreview, SharedFilePreview } from "./components/FilePreview"
import Login from "./components/Login"
import Register from "./components/Register"
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import {withAuthentication} from "./lib/withAuthentication";
const AuthenticatedOutlet = withAuthentication(Outlet)

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/share/:slug" element={ <SharedFileExplorer /> } />
      <Route path="/share/:slug/:fileId" element={ <SharedFilePreview /> } />

      <Route element={ <AuthenticatedOutlet />}>
        <Route path="/file:/*" element={ <FilePreview /> } />
        <Route path="/*" root element={ <FileExplorer /> } />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App;
