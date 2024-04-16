# Book club

## Local setup instructions

### Requirements

-   [VS Code (recommended)](https://code.visualstudio.com/)
-   [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm)

### Setup

1. If using VS Code, install all extensions under Workspace Recommendations.

2. In the root directory, run the following command to install and use the correct version of Node.

```
nvm install
```

3. Install dependencies.

```
npm install
```

4. Use the following command to start the Vue application.

```
npm run dev
```

> By default, your application will connect to the remote Dev instance of our Supabase backend.

5. Navigate to `http://localhost:3000/bookclub` to view the application.

6. Sign in either with one of our test users or through your personal Discord account.

> Test users include user1@test.com through user5@test.com. All test users use password `Test!@#4`.

> If you would like your personal Discord account to have Admin privileges in Dev please contact _jeegankones_.

## Connect to a local Supabase instance

### Requirements

-   [Docker](https://www.docker.com/)

### Setup

Supabase is the backend service we use to host our Postgres database, handle user authentication, and more. Running a local instance through the CLI is required to make any backend contributions.

1. Start your local Supabase instance.

```
npx supabase start
```

> Starting Supabase locally for the first time may take a few minutes. After it starts, it should give you some information on your local Supabase configuration. You can access this information anytime by running `npx supabase status`

2. Create a new file at the root of the project called `.env.local`
    - This file will not be checked in to git.

```
touch .env.local
```

3. Copy paste the following into your `.env.local` to configure the app to use your local Supabase instance.

```
VITE_APP_SUPABASE_URL=""
VITE_APP_SUPABASE_KEY=""
# VITE_APP_GOOGLE_BOOKS_API_KEY=""
```

-   Use your Supabase `API URL` for `VITE_APP_SUPABASE_URL`

-   Use your Supabase `anon key` for `VITE_APP_SUPABASE_KEY`

-   `VITE_APP_GOOGLE_BOOKS_API_KEY` is _optional_. This will protect you from intermittent API quota errors. You can create a free key at [https://console.cloud.google.com/apis](https://console.cloud.google.com/apis). Do not share your key.

4. Navigate to the Supabase `Studio URL` to see your local Supabase dashboard.

5. On the left, click "Database" -> "Tables" and make sure they all have realtime enabled. Then go to "Database" -> "Replication" and make sure all tables under "Source" are enabled.

    - _This is necessary for realtime updates to work in the app._

6. Sign in with one of the test users. You can find a list of seeded test users in the public.profiles table.

> All users use password `Test!@#4` by default.

> Grant admin privileges to any user by entering `admin` in the role column in the public.profiles table.

7. To run the app on your local Supabase instance use the following command.

```
npm run local
```

## Contribution guidelines

Our main working branch is `dev` and our production branch is `master`.

For now we will track all new features and bugs via Github issues. If the feature you're working on does not yet have an associated issue, create one. Be sure to add the appropriate tags to new issues.

All new feature work should branch from `dev` using the naming convention `feature/[name]` for the new branch. Eg. `feature/some-new-feature`

-   Bug fixes should use the `bug/` prefix.
-   Technical changes (no change to UI or functionality) should use the `tech/` prefix.

If your changes include backend changes made through the Supabase GUI (schema updates, RLS policies, triggers, functions, etc.) You can run the following command to generate a migration file.

```
npx supabase db diff -f [filename]
```

### Pull requests

1. Open a new pull request in Github with the target branch `dev`. Be sure to include a brief description of your change as well as the issue number.

2. Upon approval, select `Squash and merge`.

3. After you've merged your changes into the `dev` branch, test your changes on the dev site.
   [https://dev--lighthearted-narwhal-9d9f3c.netlify.app/bookclub/](https://dev--lighthearted-narwhal-9d9f3c.netlify.app/bookclub/)

4. If everything looks good, create a new PR labeled `Dev to master`

    - No description is required.

5. Upon approval, select `Create a merge commit`
