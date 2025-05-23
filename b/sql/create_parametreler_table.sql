-- Parametreler tablosu oluşturma
CREATE TABLE IF NOT EXISTS parametreler (
  parametreid SERIAL PRIMARY KEY,
  modul CHARACTER VARYING(50),
  parametreadi CHARACTER VARYING(100),
  deger CHARACTER VARYING(50),
  kayitzamani TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Örnek veri ekleme
INSERT INTO parametreler (modul, parametreadi, deger)
VALUES ('Moduller', 'Modül Kodu Default Değeri', '100')
ON CONFLICT (parametreid) DO NOTHING;