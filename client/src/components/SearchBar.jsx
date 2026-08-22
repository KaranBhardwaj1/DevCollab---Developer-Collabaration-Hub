const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search Questions..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className="w-full rounded-lg border p-3"
    />
  );
};

export default SearchBar;