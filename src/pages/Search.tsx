import { useEffect, useRef } from "preact/hooks";
import { useLocation } from "preact-iso";
import { SearchInput } from "@/features/SearchInput";
import { SearchResults } from "@/features/SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchData } from "@/hooks/useSearchData";
import { navigateToDetail } from "@/helpers/navigation";
import { searchSession } from "@/signals/search";
import { AudioVisualDto } from "@/shared/types";

export function Search() {
  const { route } = useLocation();
  const {
    fetchData,
    data,
    loadMore,
    loading,
    error,
    loadMoreError,
    retry,
    retryLoadMore,
    reset,
    restore,
  } = useSearchData();
  const searchSetterRef = useRef<(title: string) => void>(() => {});

  useEffect(() => {
    const session = searchSession.value;
    if (!session.query) return;

    if (session.data) {
      restore(session.query, session.data);
    } else {
      fetchData(session.query);
    }

    requestAnimationFrame(() => window.scrollTo(0, session.scrollY));
  }, []);

  const handleQuery = (value: string) => {
    searchSession.value = { ...searchSession.value, query: value.trim(), data: null };
    if (!value.trim()) {
      reset();
      return;
    }
    fetchData(value);
  };

  const funcDebounced = useDebounce(handleQuery, 350);

  const handleItemClick = (item: AudioVisualDto) => {
    searchSession.value = {
      query: searchSession.value.query,
      data: data,
      scrollY: window.scrollY,
    };
    navigateToDetail(item, route);
  };

  const handleRecentSearch = (title: string) => {
    searchSetterRef.current(title);
  };

  return (
    <div class="search">
      <SearchInput
        onSearch={funcDebounced}
        initialValue={searchSession.value.query}
        onSetSearchControl={(setSearch) => {
          searchSetterRef.current = setSearch;
        }}
      />
      <SearchResults
        items={data?.audiovisuals}
        total={data?.totalResults ?? 0}
        page={data?.page}
        totalPages={data?.totalPages}
        loading={loading}
        error={error}
        loadMoreError={loadMoreError}
        fetchMore={loadMore}
        retry={retry}
        retryLoadMore={retryLoadMore}
        onItemClick={handleItemClick}
        onRecentSearch={handleRecentSearch}
      />
    </div>
  );
}
