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

export async function getServerSideProps(context: {
  params?: { id?: string | string[] };
}) {
  const raw = context.params?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || typeof id !== "string") {
    return { redirect: { destination: "/", permanent: false } };
  }

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || book == null) {
    return { redirect: { destination: "/", permanent: false } };
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
}

export default function BookPage({ book, pdfPublicUrl }: Props) {
  return (
    <main className="main-page-wide">
      <a className="link-back" href="/">
        ← Back to library
      </a>

      <h1 className="title-book">{book.title}</h1>

      {!book.storage_path ? (
        <p className="text-muted">
          No <code className="code-inline">storage_path</code> set for this
          row. Add the object path inside your bucket (e.g.{" "}
          <code className="code-inline">my-file.pdf</code>).
        </p>
      ) : null}

      {book.storage_path && !pdfPublicUrl ? (
        <p className="text-danger">
          Missing <code className="code-inline">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          or invalid storage configuration.
        </p>
      ) : null}

      {pdfPublicUrl ? (
        <>
          <p className="text-small-muted">
            If the frame is blank, confirm the bucket allows public read or open{" "}
            <a
              href={pdfPublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              the PDF in a new tab
            </a>
            .
          </p>
          <iframe
            title={String(book.title)}
            src={pdfPublicUrl}
            className="pdf-frame"
          />
        </>
      ) : null}
    </main>
  );
}
