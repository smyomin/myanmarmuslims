/** Matches typical `public.books` rows — extend as your schema grows */
export type BookRow = {
  id: string | number
  title: string
  /** Path inside the Storage bucket, e.g. `folder/file.pdf` */
  storage_path?: string | null
}
