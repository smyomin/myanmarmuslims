import { supabase } from "../lib/supabaseClient";
import type { BookRow } from "../lib/types";

type HomeProps = {
  books: BookRow[];
  queryError: string | null;
};

export async function getServerSideProps() {
  const { data: books, error } = await supabase.from("books").select("*");

  return {
    props: {
      books: (books ?? []) as BookRow[],
      queryError: error ? error.message : null,
    },
  };
}

export default function Home({ books, queryError }: HomeProps) {
  return (
    <main className="main-page-narrow">
      <h1 className="title-page">PDF Library</h1>

      {queryError ? (
        <p className="alert-error">
          Could not load books: {queryError}
          <span className="hint">
            Check Row Level Security (anon SELECT on `books`) and `.env.local`
            keys for this Supabase project.
          </span>
        </p>
      ) : null}

      {!queryError && books.length === 0 ? (
        <p className="text-muted">
          No books yet. Insert rows in the{" "}
          <code className="code-inline">books</code> table and optional{" "}
          <code className="code-inline">storage_path</code> for each PDF.
        </p>
      ) : null}

      <ul className="book-list">
        {books.map((book) => (
          <li key={String(book.id)}>
            <a className="book-link" href={`/books/${book.id}`}>
              {book.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
