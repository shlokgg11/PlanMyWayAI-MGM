/*
  # Create saved_itineraries table

  ## Summary
  Creates the main data table for storing AI-generated trip itineraries saved by users.

  ## New Tables
  - `saved_itineraries`
    - `id` (uuid, primary key) - Unique identifier for each saved trip
    - `user_id` (uuid, foreign key → auth.users) - Owner of the itinerary
    - `title` (text) - Display title of the trip
    - `destination` (text) - Destination name
    - `duration` (text, nullable) - Human-readable duration e.g. "5 Days / 4 Nights"
    - `budget` (text, nullable) - Estimated total cost string
    - `summary` (text, nullable) - Brief trip summary
    - `itinerary_data` (jsonb) - Full structured itinerary JSON
    - `created_at` (timestamptz) - When the trip was saved

  ## Security
  - RLS enabled on `saved_itineraries`
  - Users can only SELECT their own saved itineraries
  - Users can only INSERT itineraries for themselves
  - Users can only DELETE their own itineraries

  ## Indexes
  - Index on `user_id` for fast per-user queries
  - Index on `created_at` for ordering
*/

CREATE TABLE IF NOT EXISTS saved_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  destination text NOT NULL DEFAULT '',
  duration text,
  budget text,
  summary text,
  itinerary_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id ON saved_itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_created_at ON saved_itineraries(created_at DESC);

ALTER TABLE saved_itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved itineraries"
  ON saved_itineraries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved itineraries"
  ON saved_itineraries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved itineraries"
  ON saved_itineraries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
