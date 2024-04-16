drop function if exists "public"."count_votes_group_by_book_id"();

alter table "public"."votes" add column "weight" bigint;


