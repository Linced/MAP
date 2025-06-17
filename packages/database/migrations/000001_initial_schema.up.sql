-- Migration: 000001_initial_schema
-- Description: Initial database setup for Market Assistant Platform

-- 1. Create schemas
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;

-- 2. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "btree_gin" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA public;

-- 3. Create base tables
CREATE TABLE app.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- 4. Create indexes for better query performance
CREATE INDEX idx_users_email ON app.users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON app.users (username) WHERE deleted_at IS NULL;

-- 5. Setup RLS policies
ALTER TABLE app.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON app.users FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON app.users FOR UPDATE 
  USING (auth.uid() = id);

-- Allow authenticated users to view public profiles (username, full_name, avatar_url only)
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON app.users FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    id IN (
      SELECT auth.uid()
      UNION
      SELECT id FROM app.users WHERE id = app.users.id
    )
  );

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Apply updated_at trigger to users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON app.users
FOR EACH ROW
EXECUTE FUNCTION app.update_updated_at_column();

-- 8. Create soft delete trigger function
CREATE OR REPLACE FUNCTION app.soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    NEW.deleted_at = NOW();
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 9. Apply soft delete trigger to users table
CREATE TRIGGER soft_delete_users
BEFORE DELETE ON app.users
FOR EACH ROW
EXECUTE FUNCTION app.soft_delete_record();

-- 10. Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION app.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
