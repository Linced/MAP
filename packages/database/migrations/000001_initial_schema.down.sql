-- Migration: 000001_initial_schema (Rollback)
-- Description: Rollback initial database setup for Market Assistant Platform

-- 1. Drop triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON app.users;
DROP TRIGGER IF EXISTS soft_delete_users ON app.users;

-- 2. Drop functions
DROP FUNCTION IF EXISTS app.update_updated_at_column();
DROP FUNCTION IF EXISTS app.soft_delete_record();
DROP FUNCTION IF EXISTS app.is_admin();

-- 3. Drop policies
DROP POLICY IF EXISTS "Users can view own profile" ON app.users;
DROP POLICY IF EXISTS "Users can update own profile" ON app.users;
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON app.users;

-- 4. Disable RLS and drop tables
ALTER TABLE IF EXISTS app.users DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS app.users;

-- 5. Drop schemas (only if they're empty)
DROP SCHEMA IF EXISTS app CASCADE;
DROP SCHEMA IF EXISTS auth CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;

-- 6. Drop extensions
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pg_trgm";
DROP EXTENSION IF EXISTS "btree_gin";
DROP EXTENSION IF EXISTS "pg_stat_statements";
