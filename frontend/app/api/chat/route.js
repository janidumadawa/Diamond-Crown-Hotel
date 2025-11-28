export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === '') {
      return Response.json({ reply: "Please enter a message." });
    }

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return Response.json({ reply: data.reply });
    
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ 
      reply: "Sorry, I'm having trouble connecting to the chat service. Please try again later." 
    });
  }
}