import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Search } from "../../../../gql/graphql";
import SEARCH_QUERY from "../../../../gql/queries/search-query";
import ChannelsDisplay, { ChannelsDisplaySkeleton } from "./channels-display";
import PlaylistDisplay, {
  PlaylistDisplaySkeleton,
} from "../../../playlists-display";
import SongsDisplay, { SongsDisplaySkeleton } from "../../../songs-display";
import useTheme from "../../../../hooks/use-theme";
import "./style.scss";
import { useNavigation } from "../../../../providers/navigation.provider";

type SearchProps = {
  searchQuery: string;
};

export default function Search({ searchQuery }: SearchProps) {
  const [search] = useLazyQuery<{ search: Search }>(SEARCH_QUERY);
  const [searchResult, setSearchResult] = useState<Search | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { pushState } = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        pushState({
          params: new Map<string, string>([["query", searchQuery]]),
        });
        const searchResult = await search({
          variables: { query: searchQuery },
        });
        setIsLoading(false);
        searchResult.data && setSearchResult(searchResult.data.search);
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [pushState, search, searchQuery]);

  const className = useTheme("search");

  return (
    <div className={className}>
      {isLoading ? (
        <>
          <ChannelsDisplaySkeleton />
          <PlaylistDisplaySkeleton />
          <SongsDisplaySkeleton />
        </>
      ) : (
        <>
          <ChannelsDisplay channels={searchResult?.channels} />
          <PlaylistDisplay playlists={searchResult?.playlists} />
          <SongsDisplay videos={searchResult?.videos} />
        </>
      )}
    </div>
  );
}
