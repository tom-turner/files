import React from "react";
import ServerCheck from "./components/ServerCheck"
import FileExplorer from "./components/FileExplorer/FileExplorer"
import Login from "./components/Login"
import FilePreview from "./components/FilePreview"
import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";


function Explorer() {
  const params = useParams()
  return (
    <div className="flex flex-col w-full mx-auto space-y-4">
      <ServerCheck />
      <FileExplorer path={ params['*'] } />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <Login /> } />
        <Route path="/file:/*" element={ <FilePreview /> } />
        <Route path="/*" root element={ <Explorer /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
