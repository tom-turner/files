import React from "react";
import ServerCheck from "./components/ServerCheck"
import FileUpload from "./components/FileUpload"
import FileExplorer from "./components/FileExplorer"
import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";

function Explorer() {
  const params = useParams()

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4">
      <ServerCheck />
      <FileUpload />
      <FileExplorer path={ params['*'] } />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" root element={ <Explorer /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
