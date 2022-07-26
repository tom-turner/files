import Login from "./views/Login"
import Register from "./views/Register"
import { OldPublicUrl } from "./views/Redirects"
import { Home } from "./views/Home"
import { MyAccount } from "./views/MyAccount"
import { Sharing } from "./views/Sharing"
import { File , FilePublic } from "./views/Files"
import { Tag, SharedTag, TagPublic } from "./views/Tags"
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import { withAuthentication } from "./context/withAuthentication";
const AuthenticatedOutlet = withAuthentication(Outlet)

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/share/*" element={ <OldPublicUrl /> } />
      <Route path="/public/:slug" element={ <TagPublic /> } />
      <Route path="/public/:slug/:fileId" element={ <FilePublic /> } />

      <Route element={ <AuthenticatedOutlet />}>
        <Route path="/*" root element={ <Home /> } />
  
        <Route path="/tag/:tagId" element={ <Tag /> } />
        <Route path="/file/:fileId" element={ <File/> } />
  
        <Route path="/sharing" element={ <Sharing /> } >
          <Route path="/sharing/:tagId" element={ <Tag /> } />
        </Route>

        <Route path="/my-account" element={ <MyAccount /> } />

      </Route>
    </Routes>

  </BrowserRouter>
}

export default App;
