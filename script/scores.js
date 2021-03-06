const SUPABASE_URL = 'https://hyebhkfmkbvvpblhrrob.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZWJoa2Zta2J2dnBibGhycm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgyMzc2MzksImV4cCI6MTk3MzgxMzYzOX0.x9UmvjtQsuS5m8dY7ynHKKxnapKxtzMMVTqnrReFviY'
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


async function readScores(array, p=null) {
    
    if (p==null) {
        const {data: sc, error: errorInfo } = await _supabase
            .from(array)
            .select('*');
        return sc}
    
    else {
        const {data: sc, error: errorInfo } = await _supabase
            .from(array)
            .select('score')
            .eq('pseudo', p);
        return sc}
}


async function insertScore(array, p, s) {
    const {scores, error} = await _supabase
        .from(array)
        .upsert({ pseudo: p, score: s});
}
