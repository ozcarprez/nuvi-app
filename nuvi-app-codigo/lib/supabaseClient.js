import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ztsxvfmlsvblkwzzuple.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_k9lf0ekCqr65ceifYB6onQ_nN_XiBDJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
