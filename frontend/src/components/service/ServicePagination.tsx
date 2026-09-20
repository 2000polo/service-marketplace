import { useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";

interface ServicePaginationProps {
  currentPage: number;
  totalPages: number;
}

const ServicePagination = ({
  currentPage,
  totalPages,
}: ServicePaginationProps) => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(
      searchParams
    );

    params.set("page", String(page));

    setSearchParams(params);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
        <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
        >
            Previous
        </Button>

        <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
        </span>

        <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
        >
            Next
        </Button>
    </div>
  );
};

export default ServicePagination;