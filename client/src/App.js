import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import ServerCheck from "./components/ServerCheck"
import FileUpload from "./components/FileUpload"
import FileExplorer from "./components/FileExplorer"

function Explorer(){
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4">
    
      <ServerCheck />
      <FileUpload />
      <FileExplorer />

    </div>
  )
}

function App() {
  return (
    <Explorer />
  );
}

export default App;
