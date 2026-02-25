import { useState, useEffect } from "react";
import { fetchRandomQuote } from "../services/quoteService";

const useQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    try {
      setLoading(true);
      const data = await fetchRandomQuote();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getQuote(); }, []);

  return { quote, author, loading, getQuote };
};

export default useQuote;