create table "public"."groups" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text
);


alter table "public"."groups" enable row level security;

create table "public"."user_groups" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "group_id" uuid
);


CREATE UNIQUE INDEX groups_pkey ON public.groups USING btree (id);

CREATE UNIQUE INDEX user_groups_pkey ON public.user_groups USING btree (id);

alter table "public"."groups" add constraint "groups_pkey" PRIMARY KEY using index "groups_pkey";

alter table "public"."user_groups" add constraint "user_groups_pkey" PRIMARY KEY using index "user_groups_pkey";

alter table "public"."user_groups" add constraint "user_groups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE not valid;

alter table "public"."user_groups" validate constraint "user_groups_group_id_fkey";

alter table "public"."user_groups" add constraint "user_groups_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_groups" validate constraint "user_groups_user_id_fkey";

create policy "groups_policy"
on "public"."groups"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_groups
  WHERE ((user_groups.user_id = auth.uid()) AND (user_groups.group_id = groups.id)))));



