import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import Register from "./components/Register"
import FilePreview from "./components/FilePreview"
import SharedTag from "./components/FileSharing/SharedTag"
import SharedFile from "./components/FileSharing/SharedFile"
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import {withAuthentication} from "./lib/withAuthentication";

const AuthenticatedOutlet = withAuthentication(Outlet)

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/share/:slug" element={ <SharedTag /> } />
      <Route path="/share/:slug/:fileId" element={ <SharedFile /> } />

      <Route element={ <AuthenticatedOutlet />}>
        <Route path="/file:/*" element={ <FilePreview /> } />
        <Route path="/*" root element={ <FileExplorer /> } />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App;
