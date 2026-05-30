INSERT INTO regions (name, slug) VALUES ('Toshkent viloyati', 'toshkent-vil') ON CONFLICT (slug) DO NOTHING;
