import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

function SharePage() {
  const { id } = useParams();
  const [chat, setChat] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/share/${id}`)
      .then((res) => res.json())
      .then((data) => setChat(data.chat));
  }, [id]);

  return (
    <div className="chats">
      {chat.map((c, idx) => (
        <div key={idx}>
          <strong>{c.role}:</strong>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {c.content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

export default SharePage;