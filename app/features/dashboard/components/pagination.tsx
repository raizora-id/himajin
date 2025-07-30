import React from "react";

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({ page, limit, total, onPageChange, onLimitChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, total);
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{total > 0 ? startItem : 0}</span> to{" "}
        <span className="font-medium">{total > 0 ? endItem : 0}</span> of{" "}
        <span className="font-medium">{total}</span> items
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 py-0.5"
            value={limit.toString()}
            onChange={(e) => {
              onLimitChange(parseInt(e.target.value));
              onPageChange(1); // Reset to first page when changing limit
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            &lt;
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(pageNum => {
              if (totalPages <= 5) return true;
              if (pageNum === 1 || pageNum === totalPages) return true;
              if (pageNum >= page - 1 && pageNum <= page + 1) return true;
              return false;
            })
            .map((pageNum, i, filtered) => (
              <React.Fragment key={pageNum}>
                {i > 0 && filtered[i - 1] !== pageNum - 1 && (
                  <span className="flex items-center justify-center h-8 w-8">...</span>
                )}
                <button
                  className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                    pageNum === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-input bg-background hover:bg-muted transition-colors"
                  }`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            ))}
          
          <button
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
