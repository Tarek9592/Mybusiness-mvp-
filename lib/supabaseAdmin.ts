import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";
export const supabaseAdmin = createClient(ENV.SUPABASE.URL, ENV.SUPABASE.SERVICE);
