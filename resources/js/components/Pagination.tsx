import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
    if (lastPage <= 1) return null;

    const pages = buildPageNumbers(currentPage, lastPage);

    return (
        <nav className="flex items-center justify-center gap-1 pt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center rounded-md px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="sr-only">Previous</span>
            </button>

            {pages.map((page, idx) =>
                page === '...' ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="px-3 py-2 text-sm text-gray-500"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                            page === currentPage
                                ? 'bg-amber-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="inline-flex items-center rounded-md px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" />
            </button>
        </nav>
    );
}

function buildPageNumbers(current: number, last: number): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(last - 1, current + delta);

    pages.push(1);

    if (rangeStart > 2) {
        pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
    }

    if (rangeEnd < last - 1) {
        pages.push('...');
    }

    if (last > 1) {
        pages.push(last);
    }

    return pages;
}
