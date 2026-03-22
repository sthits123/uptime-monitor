-- Seed initial monitoring regions
INSERT INTO region (id, name, latitude, longitude) VALUES
  (gen_random_uuid(), 'global', 0, 0),
  (gen_random_uuid(), 'asia', 35.6762, 139.6503),
  (gen_random_uuid(), 'europe', 50.1109, 8.6821)
ON CONFLICT (name) DO NOTHING;
