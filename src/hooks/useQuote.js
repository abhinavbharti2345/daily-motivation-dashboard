import { useState, useCallback, useEffect } from "react";
import { getQuote as requestQuote, prefetchQuote as warmQuote } from "../services/quoteService";

const useQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [apiCategory, setApiCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const getQuote = useCallback(async (mood = "random") => {
    try {
      setLoading(true);
      const data = await requestQuote(mood);
      setQuote(data.text);
      setAuthor(data.author);
      setApiCategory(data.category);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const prefetchQuote = useCallback((mood = "random") => {
    warmQuote(mood);
  }, []);

  useEffect(() => {
    getQuote("Motivated"); // Initial load default mood
  }, [getQuote]);

  return { quote, author, apiCategory, loading, getQuote, prefetchQuote };
};

export default useQuote;