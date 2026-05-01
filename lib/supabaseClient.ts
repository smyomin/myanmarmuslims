import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseKey = supabaseAnonKey ?? supabasePublishableKey ?? ''

// #region agent log
fetch('http://127.0.0.1:7862/ingest/653b67c2-b612-453e-9be6-48f99d78847b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'11fd53'},body:JSON.stringify({sessionId:'11fd53',runId:'pre-fix',hypothesisId:'H1',location:'lib/supabaseClient.ts:8',message:'Supabase env state on module init',data:{hasUrl:Boolean(supabaseUrl),hasAnonKey:Boolean(supabaseAnonKey),hasPublishableKey:Boolean(supabasePublishableKey),selectedKeySource:supabaseAnonKey?'anon':supabasePublishableKey?'publishable':'none',urlLooksValid:Boolean(supabaseUrl && supabaseUrl.startsWith('http'))},timestamp:Date.now()})}).catch(()=>{});
// #endregion

if (!supabaseUrl || !supabaseKey) {
  // #region agent log
  fetch('http://127.0.0.1:7862/ingest/653b67c2-b612-453e-9be6-48f99d78847b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'11fd53'},body:JSON.stringify({sessionId:'11fd53',runId:'pre-fix',hypothesisId:'H2',location:'lib/supabaseClient.ts:13',message:'Supabase client missing required env value',data:{hasUrl:Boolean(supabaseUrl),hasKey:Boolean(supabaseKey)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
}

export const supabase = createClient(supabaseUrl!, supabaseKey!)

// #region agent log
fetch('http://127.0.0.1:7862/ingest/653b67c2-b612-453e-9be6-48f99d78847b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'11fd53'},body:JSON.stringify({sessionId:'11fd53',runId:'pre-fix',hypothesisId:'H3',location:'lib/supabaseClient.ts:20',message:'Supabase client created',data:{selectedKeySource:supabaseAnonKey?'anon':supabasePublishableKey?'publishable':'none'},timestamp:Date.now()})}).catch(()=>{});
// #endregion