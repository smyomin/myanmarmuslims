import type { GetServerSideProps } from "next";
import { supabase } from "../../lib/supabaseClient";
import type { BookRow } from "../../lib/types";

type Props = {
  book: BookRow;
  pdfPublicUrl: string | null;
};

function buildPublicStorageUrl(
  storagePath: string,
  bucket: string
): string | null {
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  if (!base || !storagePath) return null;
  const path = storagePath.replace(/^\/+/, "");
  const b = bucket.replace(/^\/+|\/+$/g, "");
  return `${base}/storage/v1/object/public/${b}/${path}`;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const raw = context.params?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || typeof id !== "string") {
    return { notFound: true };
  }

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || book == null) {
    return { notFound: true };
  }

  const row = book as BookRow;
  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "pdfs";

  const pdfPublicUrl =
    row.storage_path && row.storage_path.length > 0
      ? buildPublicStorageUrl(row.storage_path, bucket)
      : null;

  return {
    props: {
      book: row,
      pdfPublicUrl,
    },
  };
};

export default function BookPage({ book, pdfPublicUrl }: Props) {
  return (
    <main className="p-6 max-w-4xl mx-auto flex flex-col gap-4 min-h-screen">
      <a
        href="/"
        className="text-sm text-neutral-600 dark:text-neutral-400 hover:underline"
      >
        ← Back to library
      </a>

      <h1 className="text-2xl font-bold">{book.title}</h1>

      {!book.storage_path ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">storage_path</code>{" "}
          set for this row. Add the object path inside your bucket (e.g.{" "}
          <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">my-file.pdf</code>
          ).
        </p>
      ) : null}

      {book.storage_path && !pdfPublicUrl ? (
        <p className="text-red-600 dark:text-red-400">
          Missing <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          or invalid storage configuration.
        </p>
      ) : null}

      {pdfPublicUrl ? (
        <>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            If the frame is blank, confirm the bucket allows public read or open{" "}
            <a
              href={pdfPublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              the PDF in a new tab
            </a>
            .
          </p>
          <iframe
            title={book.title}
            src={pdfPublicUrl}
            className="w-full flex-1 min-h-[75vh] border border-neutral-200 dark:border-neutral-700 rounded"
          />
        </>
      ) : null}
    </main>
  );
}
