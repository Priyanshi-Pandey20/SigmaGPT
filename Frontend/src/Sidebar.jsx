import React, { useEffect } from "react";
import "./Sidebar.css";
import { useContext } from "react";
import { MyContext } from "./assets/MyContext";
import { v1 as uuidv1 } from "uuid";
import { apiFetch } from "./utils/api.js";   // ✅ import

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await apiFetch("/thread");   // ✅
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await apiFetch(`/thread/${newThreadId}`);   // ✅
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await apiFetch(`/thread/${threadId}`, { method: "DELETE" });   // ✅

      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <section className="sidebar">
        <button onClick={createNewChat}>
          <img className="logo" src="src/assets/blacklogo.png" alt="gpt logo" />
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li key={idx} onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : " "}
            >
              {thread.title}
              <i className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p><span>ByApna College &hearts;</span></p>
        </div>
      </section>
    </div>
  );
}

export default Sidebar;