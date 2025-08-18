
import ReactPaginate from "react-paginate";
import css from "../App/App.module.css";

interface ReactPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export default function ReactPagination({ totalPages, page, setPage }: ReactPaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={(event: { selected: number }) => setPage(event.selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}