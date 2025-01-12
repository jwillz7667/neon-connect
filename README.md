# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/90ca42b0-a0f6-49b9-8b24-d3f6bbe80f71

## Database Schema

This project uses Supabase as its backend. Here's the database schema:

### Tables

#### profiles
- `id` (uuid, PK): User's unique identifier
- `username` (text): User's username
- `full_name` (text): User's full name
- `avatar_url` (text): URL to user's avatar
- `bio` (text): User's biography
- `location` (text): User's general location
- `email` (text): User's email address
- `website` (text): User's website
- `city` (text): User's city
- `state` (text): User's state
- `is_verified` (boolean): Verification status
- `verification_documents` (jsonb): Verification document data
- `verification_status` (text): Status of verification process
- `provider_since` (timestamp): When user became a provider
- `created_at` (timestamp): Record creation date
- `updated_at` (timestamp): Record last update date

#### subscriptions
- `id` (uuid, PK): Subscription unique identifier
- `user_id` (uuid, FK): References profiles.id
- `tier` (text): Subscription tier ('standard' or 'priority')
- `status` (text): Subscription status
- `stripe_customer_id` (text): Stripe customer identifier
- `stripe_subscription_id` (text): Stripe subscription identifier
- `current_period_end` (timestamp): Subscription period end date
- `created_at` (timestamp): Record creation date
- `updated_at` (timestamp): Record last update date

#### posts
- `id` (uuid, PK): Post unique identifier
- `user_id` (uuid, FK): References profiles.id
- `content` (text): Post content
- `media_urls` (text[]): Array of media URLs
- `likes_count` (integer): Number of likes
- `comments_count` (integer): Number of comments
- `is_edited` (boolean): Edit status
- `created_at` (timestamp): Record creation date
- `updated_at` (timestamp): Record last update date

#### comments
- `id` (uuid, PK): Comment unique identifier
- `post_id` (uuid, FK): References posts.id
- `user_id` (uuid, FK): References profiles.id
- `content` (text): Comment content
- `likes_count` (integer): Number of likes
- `parent_comment_id` (uuid, FK): References comments.id for nested comments
- `is_edited` (boolean): Edit status
- `created_at` (timestamp): Record creation date
- `updated_at` (timestamp): Record last update date

#### likes
- `id` (uuid, PK): Like unique identifier
- `user_id` (uuid, FK): References profiles.id
- `post_id` (uuid, FK): References posts.id
- `comment_id` (uuid, FK): References comments.id
- `created_at` (timestamp): Record creation date

#### follows
- `id` (uuid, PK): Follow relationship unique identifier
- `follower_id` (uuid, FK): References profiles.id
- `following_id` (uuid, FK): References profiles.id
- `created_at` (timestamp): Record creation date

#### tags
- `id` (uuid, PK): Tag unique identifier
- `name` (text): Tag name
- `created_at` (timestamp): Record creation date

#### post_tags
- `post_id` (uuid, FK): References posts.id
- `tag_id` (uuid, FK): References tags.id
- `created_at` (timestamp): Record creation date

#### notifications
- `id` (uuid, PK): Notification unique identifier
- `user_id` (uuid, FK): References profiles.id
- `type` (text): Notification type
- `content` (jsonb): Notification content
- `is_read` (boolean): Read status
- `created_at` (timestamp): Record creation date

#### user_settings
- `user_id` (uuid, PK, FK): References profiles.id
- `theme_preference` (text): UI theme preference
- `language_preference` (text): Language preference
- `notification_preferences` (jsonb): Notification settings
- `privacy_settings` (jsonb): Privacy settings
- `created_at` (timestamp): Record creation date
- `updated_at` (timestamp): Record last update date

## Environment Variables

This project requires the following Supabase environment variables:

```env
STRIPE_SECRET_KEY=<your-stripe-secret-key>
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
SUPABASE_DB_URL=<your-supabase-db-url>
VITE_STRIPE_ENTERPRISE_PRICE_ID=<your-stripe-enterprise-price-id>
VITE_STRIPE_BASIC_PRICE_ID=<your-stripe-basic-price-id>
VITE_STRIPE_PRO_PRICE_ID=<your-stripe-pro-price-id>
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/90ca42b0-a0f6-49b9-8b24-d3f6bbe80f71) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/90ca42b0-a0f6-49b9-8b24-d3f6bbe80f71) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)