export const fetchRandomQuote = async () => {
  const response = await fetch("https://dummyjson.com/quotes/random");

  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }

  const data = await response.json();

  return {
    content: data.quote,
    author: data.author,
  };
};