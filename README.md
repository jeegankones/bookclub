# Book club

## Local setup requirements

-   [VS Code (recommended)](https://code.visualstudio.com/)
-   [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm)
-   [Docker](https://www.docker.com/)

## Local setup instructions

-   If using VS Code, install all extensions under Workspace Recommendations
-   In the root directory, run the following command to install and use the correct version of Node.

```
nvm use
```

-   Install npm dependencies.

```
npm install
```

-   Start your local Supabase instance. Supabase is the backend service we use to host our Postgres database, handle user authentication, and more.

```
npx supabase start
```

-   Starting Supabase locally for the first time may take a few minutes. After it starts, it should give you some information on your local Supabase configuration. You can access this information anytime by running `npx supabase status`

-   Create a new file at the root of the project called `.env.local` this file will not be checked in to git.

```
touch .env.local
```

-   Copy paste the following into your `.env.local` to configure the app to use your local Supabase instance.

```
VITE_APP_SUPABASE_URL=""
VITE_APP_SUPABASE_KEY=""
VITE_APP_SUPABASE_REDIRECT_URL="http://localhost:3000/bookclub"
# VITE_APP_GOOGLE_BOOKS_API_KEY=""
```

-   Use your `API URL` for `VITE_APP_SUPABASE_URL`
-   Use your `anon key` for `VITE_APP_SUPABASE_KEY`
-   `VITE_APP_GOOGLE_BOOKS_API_KEY` is optional. This will protect you from intermittent API quota errors. You can create a free key at [https://console.cloud.google.com/apis](https://console.cloud.google.com/apis). Do not share your key.

-   Navigate to the `Studio URL` to see your local Supabase dashboard.

    -   On the left, click "Database" -> "Replication" and make sure to enable all tables under "Source". Then go to "Database" -> "Tables" and make sure they all have realtime enabled. _This is necessary for realtime updates to work in the app._

-   Use the following command to start the Vue application

```
npm run dev
```

-   Navigate to `http://localhost:3000/bookclub` to view the application. Once you sign in, a new row will be added automatically to the auth.users table as well as public.profiles.

-   Give yourself admin privileges by changing the `role` column for your user in public.profiles to `admin`.

## Contribution guidelines

Our main working branch is `dev` and our production branch is `master`.

For now we will track all new features and bugs via Github issues. If the feature you're working on does not yet have an associated issue, create one. Be sure to add the appropriate tags to new issues.

All new feature work should branch from `dev` using the naming convention `feature/[name]` for the new branch. Eg. `feature/some-new-feature`

-   Bug fixes should use the `bug/` prefix
-   Technical changes (no change to UI or functionality) should use the `tech/` prefix

If your changes include backend changes made through the Supabase GUI (schema updates, RLS policies, triggers, functions, etc.) You can run the following command to generate a migration file.

```
npx supabase db diff -f [filename]
```

Once your changes are committed and pushed, open a new pull request in Github with the target branch `dev`. Be sure to include a brief description of your change as well as the issue number.
