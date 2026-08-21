// CONFIGURACIÓN DE SUPABASE

const SUPABASE_URL = "https://lkjzrotdtvxhvmcekfjy.supabase.co";

const SUPABASE_KEY = "sb_publishable_rjZgiq_if_KszR8YL0QtbA__UNuz9pV";

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado correctamente");