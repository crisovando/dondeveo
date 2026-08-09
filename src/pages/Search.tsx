import { SearchInput } from "@/features/SearchInput";
import { SearchResults } from "@/features/SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchData } from "@/hooks/useSearchData";

export function Search() {
  const { fetchData, data, loadMore, loading, error, reset } = useSearchData();

  const onSearch = (value: string) => {
    if (!value.trim()) {
      reset();
      return;
    }
    fetchData(value);
  };

  const funcDebounced = useDebounce(onSearch, 350);

  return (
    <div class="search">
      <SearchInput onSearch={funcDebounced} />
      <SearchResults
        items={data?.audiovisuals}
        total={data?.totalResults ?? 0}
        loading={loading}
        error={error}
        fethMore={loadMore}
      />
    </div>
  );
}