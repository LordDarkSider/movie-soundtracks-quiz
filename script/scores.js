const SUPABASE_URL = 'https://hyebhkfmkbvvpblhrrob.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZWJoa2Zta2J2dnBibGhycm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgyMzc2MzksImV4cCI6MTk3MzgxMzYzOX0.x9UmvjtQsuS5m8dY7ynHKKxnapKxtzMMVTqnrReFviY'
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function load_scores() {
    const { scores, error } = await _supabase
            .from('Normal Ranking')
            .select('*')

    console.log(scores)
    console.log(error)
}
load_scores()
