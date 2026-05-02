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
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF Library</h1>

      {queryError ? (
        <p className="text-red-600 dark:text-red-400 border border-red-300 rounded p-3 mb-4">
          Could not load books: {queryError}
          <span className="block text-sm mt-2 opacity-90">
            Check Row Level Security (anon SELECT on `books`) and `.env.local`
            keys for this Supabase project.
          </span>
        </p>
      ) : null}

      {!queryError && books.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No books yet. Insert rows in the <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">books</code> table and optional{" "}
          <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">storage_path</code> for each PDF.
        </p>
      ) : null}

      <ul className="space-y-2 mt-4">
        {books.map((book) => (
          <li key={String(book.id)}>
            <a
              href={`/books/${book.id}`}
              className="block border border-neutral-200 dark:border-neutral-700 rounded p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              {book.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
