drop policy "Enable read access for all users" on "public"."profiles";

create policy "Enable read access for authenticated users"
on "public"."profiles"
as permissive
for select
to authenticated
using (true);



