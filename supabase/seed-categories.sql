-- Sample products for each category page (anime, gym, college, mafia, office).
-- Run in Supabase → SQL Editor. Prices are in paisa. Safe to re-run.
insert into public.products (slug, title, description, price, mrp, image_url, sizes, rating, reviews_count, badge, category)
values
  ('anime-hero-tee',   'Anime Hero Tee',    'Bold anime graphic on premium cotton.',      59900, 129900, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.7, 88,  'TRENDING',    'anime'),
  ('anime-mecha-tee',  'Mecha Strike Tee',  'Futuristic mecha print, oversized fit.',     64900, 139900, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=687', array['M','L','XL'],     4.6, 54,  'NEW',         'anime'),

  ('gym-beast-tee',    'Beast Mode Tee',    'Sweat-wicking fabric for heavy lifting.',    54900, 109900, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL','XXL'], 4.8, 120, 'BEST SELLER', 'gym'),
  ('gym-pump-tank',    'Pump Cover Tank',   'Breathable tank for the grind.',             44900, 89900,  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.5, 73,  null,          'gym'),

  ('college-varsity-tee', 'Varsity Classic Tee', 'Campus-ready everyday essential.',       49900, 99900,  'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.4, 61,  null,          'college'),
  ('college-crew-tee',    'Campus Crew Tee',     'Soft cotton crew neck for lectures & chai.', 47900, 94900, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.6, 47, 'NEW',          'college'),

  ('mafia-don-tee',    'The Don Tee',       'Pinstripe-inspired, strictly fashion.',      69900, 149900, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=687', array['M','L','XL'],     4.9, 35,  'BEST SELLER', 'mafia'),
  ('mafia-omerta-tee', 'Omertà Tee',        'Silence speaks. Heavyweight black tee.',     64900, 139900, 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.7, 28,  null,          'mafia'),

  ('office-formal-tee','Smart Formal Tee',  'Polished look for the modern workplace.',    52900, 104900, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.3, 40,  null,          'office'),
  ('office-minimal-tee','Minimal Pocket Tee','Clean lines, subtle chest pocket.',         54900, 109900, 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=687', array['S','M','L','XL'], 4.5, 52, 'TRENDING',     'office')
on conflict (slug) do nothing;
