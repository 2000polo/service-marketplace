import { useSearchParams } from "react-router";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ServiceFilters = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const category = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget
    );

    const searchValue =
      formData.get("search")?.toString().trim() ?? "";

    const cityValue =
      formData.get("city")?.toString().trim() ?? "";

    const categoryValue =
      formData.get("category")?.toString().trim() ?? "";

    const minPriceValue =
      formData.get("minPrice")?.toString().trim() ?? "";

    const maxPriceValue =
      formData.get("maxPrice")?.toString().trim() ?? "";

    const sortValue =
      formData.get("sort")?.toString() ?? "";

    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (cityValue) {
      params.set("city", cityValue);
    }

    if (categoryValue) {
      params.set("category", categoryValue);
    }

    if (minPriceValue) {
      params.set("minPrice", minPriceValue);
    }

    if (maxPriceValue) {
      params.set("maxPrice", maxPriceValue);
    }

    if (sortValue) {
      params.set("sort", sortValue);
    }

    setSearchParams(params);
  };

  const handleClear = () => {
    setSearchParams({});
  };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal className="size-5" />

        <h2 className="font-semibold">
          Find a service
        </h2>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Search */}
        <div className="relative">
          <Search
            className="
              absolute left-3 top-1/2
              size-4 -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            name="search"
            placeholder="Search services..."
            defaultValue={search}
            className="pl-9"
          />
        </div>

        {/* City */}
        <Input
          name="city"
          placeholder="City"
          defaultValue={city}
        />

        {/* Category */}
        <Input
          name="category"
          placeholder="Category"
          defaultValue={category}
        />

        {/* Minimum Price */}
        <Input
          name="minPrice"
          type="number"
          min="0"
          placeholder="Minimum price"
          defaultValue={minPrice}
        />

        {/* Maximum Price */}
        <Input
          name="maxPrice"
          type="number"
          min="0"
          placeholder="Maximum price"
          defaultValue={maxPrice}
        />

        {/* Sort */}
        <select
          name="sort"
          defaultValue={sort}
          className="
            border-input
            bg-transparent
            flex h-9 w-full
            rounded-md border
            px-3 py-1
            text-sm
            shadow-xs
            outline-none
            focus-visible:border-ring
            focus-visible:ring-ring/50
            focus-visible:ring-[3px]
          "
        >
          <option value="">
            Sort by
          </option>

          <option value="price_asc">
            Price: Low to High
          </option>

          <option value="price_desc">
            Price: High to Low
          </option>
        </select>

        {/* Actions */}
        <div className="flex gap-3 md:col-span-2 lg:col-span-3">
          <Button type="submit">
            Search services
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            Clear filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceFilters;