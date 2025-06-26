import dotenv from 'dotenv';
dotenv.config();

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://loqjctqlroqrvxfoqdjr.supabase.co'
const supabaseServiceRoleKey = process.env.SERVICE_ROLE

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

module.exports = supabase
