import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  // #region agent log
  await fetch('http://127.0.0.1:7862/ingest/653b67c2-b612-453e-9be6-48f99d78847b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'11fd53'},body:JSON.stringify({sessionId:'11fd53',runId:'pre-fix',hypothesisId:'H4',location:'app/page.tsx:4',message:'Home route execution started',data:{route:'/'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const { data: books, error } = await supabase.from('books').select('*')

  // #region agent log
  await fetch('http://127.0.0.1:7862/ingest/653b67c2-b612-453e-9be6-48f99d78847b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'11fd53'},body:JSON.stringify({sessionId:'11fd53',runId:'pre-fix',hypothesisId:'H5',location:'app/page.tsx:9',message:'Supabase books query finished',data:{hasError:Boolean(error),errorMessage:error?.message ?? null,bookCount:books?.length ?? 0},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">PDF Library</h1>

      {books?.map((book) => (
        <a key={book.id} href={`/books/${book.id}`}>
          <div className="border p-4 mt-2">
            {book.title}
          </div>
        </a>
      ))}
    </main>
  )
}