import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import SelectedTab from "../../types/selected-tab.type";
import "./style.scss";
import { useNavigation } from "../../providers/navigation.provider";
import useTheme from "../../hooks/useTheme";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const { setSelectedTab } = useNavigation();
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const className = useTheme("search-bar");

  return (
    <div
      className={className}
      onClick={() => setSelectedTab(SelectedTab.Search)}
    >
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={onChange}
      />
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
    </div>
  );
}
