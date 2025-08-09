import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";
export const supabaseClient = createClient(ENV.SUPABASE.URL, ENV.SUPABASE.ANON);
