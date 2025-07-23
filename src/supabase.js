import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hafbinhrphkqningqwmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZmJpbmhycGhrcW5pbmdxd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTM3NTUsImV4cCI6MjA2ODI4OTc1NX0.__NkWib4wwFee6Iw8re4xbfGh48xsQEUCFLwsHt2q0w'

export const supabase = createClient(supabaseUrl, supabaseKey)
