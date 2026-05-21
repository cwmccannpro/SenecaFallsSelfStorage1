import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// SSR-safe: storage is undefined on the server (no localStorage), client hydration
// picks up the session from localStorage automatically.
export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
