import React, { useContext, useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./ChatWindow.css";
import Chat from "./Chat";
import Settings from "./Settings";
import { MyContext } from "./assets/MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { apiFetch } from "./utils/api.js";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    sendOnEnter: true,
    autoScroll: true,
    fontSize: "Medium",
    micLang: "en-US",
    tts: false,
  });

  const chatContainerRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { id } = useParams();

  useEffect(() => {
    const sizeMap = { Small: "0.8rem", Medium: "0.95rem", Large: "1.1rem" };
    document.documentElement.style.setProperty(
      "--chat-font-size",
      sizeMap[settings.fontSize],
    );
  }, [settings.fontSize]);

  useEffect(() => {
    if (settings.autoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [prevChats, settings.autoScroll]);

  const speak = (text) => {
    if (!settings.tts) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.micLang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (transcript) setPrompt(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!listening && transcript) {
      handleSend(transcript);
      resetTranscript();
    }
  }, [listening]);

  const handleMic = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser does not support speech recognition");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: settings.micLang, // ✅ wired up
      });
    }
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    const hljsTheme = document.getElementById("hljs-theme");
    hljsTheme.href =
      newTheme === "dark"
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
  };

  useEffect(() => {
    if (!id) return;
    const fetchSharedChat = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/share/${id}`);
        const data = await res.json();
        if (!data.chat) return;
        setPrevChats(data.chat);
        setCurrThreadId(id);
        setNewChat(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSharedChat();
  }, [id]);

  const handleShare = async () => {
    try {
      const response = await apiFetch("/share", {
        method: "POST",
        body: JSON.stringify({ chats: prevChats }),
      });
      const data = await response.json();
      const shareURL = `${window.location.origin}/share/${data.id}`;
      await navigator.clipboard.writeText(shareURL);
      alert("Share link copied!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async (customPrompt) => {
    const userMessage = customPrompt || prompt;
    if (!userMessage.trim()) return;

    setLoading(true);
    setNewChat(false);
    setPrompt("");

    setPrevChats((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await apiFetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage, threadId: currThreadId }),
      });
      const res = await response.json();
      setReply(res.reply);
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
      speak(res.reply); // 🔊 TTS if enabled
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <div className="chatWindow">
      {/* NAVBAR */}
      <div className="navbar">
       <span>
  SigmaGPT <i className="fa-solid fa-angle-down"></i>
</span>
        <div className="userIconDiv">
          <span className="themeIcon" onClick={toggleTheme}>
            <i
              className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
            ></i>
          </span>
          <span className="shareIcon" onClick={handleShare}>
            <i className="fa-solid fa-share-nodes"></i>
          </span>
          <span className="userIcon" onClick={() => setIsOpen(!isOpen)}>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* DROPDOWN */}
    {/* DROPDOWN */}
{isOpen && (
  <div className="dropDown">
    {/* ✅ show username at top */}
    <div className="dropDownUser">
      <i className="fa-solid fa-user"></i>
      <span>{user.username || "User"}</span>
    </div>

    <div className="dropDownDivider"></div>

    <div className="dropDownItem" onClick={() => { setShowSettings(true); setIsOpen(false); }}>
      Setting <i className="fa-solid fa-gear"></i>
    </div>
    <div className="dropDownItem" onClick={handleLogout}>
      Log Out <i className="fas fa-sign-out-alt"></i>
    </div>
  </div>
)}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          settings={settings}
          setSettings={setSettings}
          onClearChat={() => {
            setPrevChats([]);
            setCurrThreadId(null);
            setNewChat(true);
          }}
          onDeleteAll={() => {
            setPrevChats([]);
            setCurrThreadId(null);
            setNewChat(true);
          }}
        />
      )}

      {/* CHAT — pass ref for auto-scroll */}
      <Chat containerRef={chatContainerRef} />

      {/* LOADER */}
      {loading && (
        <div className="loaderContainer">
          <ScaleLoader color={theme === "dark" ? "#fff" : "#000"} />
        </div>
      )}

      {/* INPUT */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && settings.sendOnEnter && handleSend()
            }
          />
          <div className="micIcon" onClick={handleMic}>
            <i
              className={`fa-solid ${listening ? "fa-microphone-slash" : "fa-microphone"}`}
            ></i>
          </div>
          <div id="submit" onClick={() => handleSend()}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
