# Database Package

This package contains the database schema, migrations, and related utilities for the Market Assistant Platform.

## Schema

The database is organized into several schemas:

- `app`: Application-specific tables and functions
- `auth`: Authentication and authorization tables (managed by Supabase Auth)
- `storage`: File storage tables (managed by Supabase Storage)

## Migrations

Migrations are stored in the `migrations` directory and follow the naming convention:
```
{version}_{description}.up.sql   # Applies the migration
{version}_{description}.down.sql # Reverts the migration
```

### Current Schema

#### `app.users`
Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | User's email (unique) |
| username | TEXT | Username (unique) |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | URL to user's avatar |
| subscription_tier | TEXT | User's subscription level |
| created_at | TIMESTAMPTZ | When the user was created |
| updated_at | TIMESTAMPTZ | When the user was last updated |
| deleted_at | TIMESTAMPTZ | When the user was soft-deleted (NULL if active) |

## Usage

Apply migrations using the Supabase CLI:

```bash
# Apply all pending migrations
supabase migration up

# Rollback the last migration
supabase migration down
```

## Security

- Row Level Security (RLS) is enabled on all tables
- Default policies restrict access to user's own data
- Soft deletes are used instead of hard deletes when possible
- Sensitive operations require authentication

## Best Practices

1. Always write both up and down migrations
2. Include comments explaining complex operations
3. Test migrations in a development environment before applying to production
4. Back up the database before running migrations in production
5. Use transactions for multi-statement migrations
