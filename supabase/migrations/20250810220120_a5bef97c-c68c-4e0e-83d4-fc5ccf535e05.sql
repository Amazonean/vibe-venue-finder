-- Ensure avatars bucket exists and is public
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

-- Create storage policies for avatars bucket if they don't already exist
-- Public can read avatar images
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Avatar images are publicly accessible'
  ) then
    create policy "Avatar images are publicly accessible"
      on storage.objects
      for select
      using (bucket_id = 'avatars');
  end if;
end $$;

-- Authenticated users can upload to avatars bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload avatars'
  ) THEN
    CREATE POLICY "Users can upload avatars"
      ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Users can update their own files in avatars bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update own avatars'
  ) THEN
    CREATE POLICY "Users can update own avatars"
      ON storage.objects
      FOR UPDATE
      USING (bucket_id = 'avatars' AND owner = auth.uid());
  END IF;
END $$;

-- Users can delete their own files in avatars bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete own avatars'
  ) THEN
    CREATE POLICY "Users can delete own avatars"
      ON storage.objects
      FOR DELETE
      USING (bucket_id = 'avatars' AND owner = auth.uid());
  END IF;
END $$;