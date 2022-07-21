import { Home } from "./views/Home"
import { TagView } from "./views/Tags"
import { SharedFilesRoot, SharedFilesTag } from "./views/Sharing"
import { FilePreview, SharedFilePreview } from "./views/FilePreview"
import Login from "./views/Login"
import Register from "./views/Register"
import { SharedFileExplorer } from "./components/FileExplorer/SharedFileExplorer"
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import {withAuthentication} from "./context/withAuthentication";
const AuthenticatedOutlet = withAuthentication(Outlet)

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/share/:slug" element={ <SharedFileExplorer /> } />
      <Route path="/share/:slug/:fileId" element={ <SharedFilePreview /> } />

      <Route element={ <AuthenticatedOutlet />}>
        <Route path="/*" root element={ <Home /> } />
        <Route path="/tag/:id" element={ <TagView /> } />
        <Route path="/file/:id" element={ <FilePreview /> } />
        <Route path="/sharing" element={ <SharedFilesRoot /> } />
        <Route path="/sharing/:id" element={ <SharedFilesTag /> } />
      </Route>
    </Routes>

  </BrowserRouter>
}

export default App;
