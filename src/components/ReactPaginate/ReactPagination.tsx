import ReactPaginate from "react-paginate";
import css from "../App/App.module.css";

interface ReactPaginationProps {
  pageCount: number; // всего страниц
  forcePage: number; // текущая страница (индекс начинается с 0)
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function ReactPagination({ pageCount, forcePage, onPageChange }: ReactPaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
    />
  );
}