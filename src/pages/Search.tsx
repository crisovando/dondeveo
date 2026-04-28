import { SearchInput } from "@/features/SearchInput";
import { SearchResults } from "@/features/SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchData } from "@/hooks/useSearchData";

export function Search() {
  const { fetchData, data, loadMore } = useSearchData();

  const onSearch = (value: string) => {
    fetchData(value);
  };

  const funcDebounced = useDebounce(onSearch);

  return (
    <div class="search">
      <SearchInput onSearch={funcDebounced} />
      <SearchResults
        items={data?.audiovisuals}
        total={data?.totalResults ?? 0}
        fethMore={loadMore}
      />
    </div>
  );
}
