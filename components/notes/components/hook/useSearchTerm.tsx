import { usePostContext } from "./postContext";

export const useSearchTerm = (text: string) => {//функция для подсветки поискового запроса
  const { searchTerm } = usePostContext();
  if (!searchTerm) return text;
  if (!text.toLowerCase().includes(searchTerm.toLowerCase())) return text;

  return text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} className="marked-text">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};


