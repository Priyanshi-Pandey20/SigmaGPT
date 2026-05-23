import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import "./App.css";
import SideBar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./assets/MyContext.jsx";
import SharePage from "./SharePage.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <Router>
      <MyContext.Provider value={providerValues}>
        <Routes>
          {/* 🟢 Main Chat App */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="app">
                  <SideBar />
                  <ChatWindow />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 🔗 Shared Chat Page */}

          <Route path="/share/:id" element={<ChatWindow />} />

          <Route
            path="/login"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/" replace />
              ) : (
                <Register />
              )
            }
          />
        </Routes>
      </MyContext.Provider>
    </Router>
  );
}

export default App;
