import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chat.css";
import { MyContext } from "./assets/MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

function Chat({ containerRef }) {
  const { newChat, prevChats, reply, setSavedMessages } = useContext(MyContext); // ✅ added setSavedMessages

  const [latestReply, setLatestReply] = useState(null);
  const bottomRef = useRef(null);
  const chatsRef = useRef(null);

  // ⭐ Save message to library
  const saveMessage = (content) => {
    setSavedMessages(prev => [...prev, { content }]);
  };

  // ✅ Add copy buttons to all code blocks
  useEffect(() => {
    if (!chatsRef.current) return;

    const codeBlocks = chatsRef.current.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.innerHTML = `<i class="fa-regular fa-copy"></i>`;

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code")?.innerText || "";
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
          setTimeout(() => {
            btn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }, [prevChats, latestReply]);

  // ✅ Typing animation
  useEffect(() => {
    if (!reply) {
      setLatestReply(null);
      return;
    }

    const words = reply.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, index + 1).join(" "));
      index++;

      if (index >= words.length) {
        clearInterval(interval);
        setLatestReply(null);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [reply]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  return (
    <>
      {newChat && <h1>Start a new Chat!</h1>}

      <div className="chats" ref={(el) => { chatsRef.current = el; if (containerRef) containerRef.current = el; }}>
        {prevChats?.map((chat, idx) => {
          const isLast = idx === prevChats.length - 1;

          if (chat.role === "assistant") {
            return (
              <div className="gptDiv" key={idx}>
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                >
                  {isLast && latestReply !== null ? latestReply : chat.content}
                </ReactMarkdown>

                {/* ⭐ Star button */}
                <button className="star-btn" onClick={() => saveMessage(chat.content)}>
                  <i className="fa-regular fa-star"></i>
                </button>
              </div>
            );
          }

          return (
            <div className="userDiv" key={idx}>
              <p className="userMessage">{chat.content}</p>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>
    </>
  );
}

export default Chat;