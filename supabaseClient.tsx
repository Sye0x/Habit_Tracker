import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // important for RN

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

export const supabase = createClient("https://rgrklfaoivnzkdldziea.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncmtsZmFvaXZuemtkbGR6aWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDM2NzcsImV4cCI6MjA3MTY3OTY3N30.fz-4gJQ37CJPO3yI2IDiOcFFQi3ufPYveBi-yRvmWVY");
