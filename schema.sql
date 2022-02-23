CREATE TYPE parking_pricing_type AS ENUM ('gratuit', 'communautaire', 'résidentiel', 'touristique', 'privé');

CREATE TABLE parking (
	id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	name text UNIQUE NOT NULL,
	address text UNIQUE NOT NULL,
	number_of_places int NOT NULL,
	number_of_accessible_places int NOT NULL DEFAULT 0,
	pricing parking_pricing_type NOT NULL DEFAULT 'gratuit',
	always_open boolean NOT NULL DEFAULT false,
	opening_hour time DEFAULT '06:00:00',
	closing_hour time DEFAULT '22:00:00',
	area text NOT NULL,
	CONSTRAINT parking_places_positive CHECK (number_of_places > 0),
	CONSTRAINT parking_accessible_places_rational CHECK (number_of_accessible_places <= number_of_places),
	CONSTRAINT parking_always_open_or_hours CHECK (always_open OR opening_hour IS NOT NULL AND closing_hour IS NOT NULL)
);

INSERT INTO parking (name, address, number_of_places, number_of_accessible_places, pricing, always_open, opening_hour, closing_hour, area) VALUES
('Parking du Centre-Ville', 'rue du Maréchal Leclerc', 60, 10, 'gratuit', true, NULL, NULL, 'centre-ville'),
('Parking Verney', 'Esplanade Yves Verney', 14, 2, 'touristique', false, '08:00:00', '22:00:00', 'centre-ville'),
('Parking du marché', '16 Rue Raphaël Veïl', 100, 5, 'gratuit', true, NULL, NULL, 'hopital'),
('Parking grands prés', 'rue des Grands Prés', 25, 0, 'résidentiel', true, NULL, NULL, 'hopital'),
('Parking Orillois', 'rue de l''Orillois', 70, 10, 'gratuit', true, NULL, NULL, 'la Bodinais')
ON CONFLICT DO NOTHING;

CREATE TYPE maintenance_nature AS ENUM ('rénovation', 'mise en conformité - sécurité', 'mise en conformité - équipements', 'mise en conformité - accessibilité', 'agrandissement');

CREATE TABLE maintenance (
	id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	start_date date NOT NULL,
	end_date date NOT NULL,
	number_of_unaffected_places int,
	nature maintenance_nature NOT NULL,
	parking_id int NOT NULL REFERENCES parking (id),
	CONSTRAINT maintenance_dates_order CHECK (start_date < end_date),
  CONSTRAINT maintenance_places_positive CHECK (number_of_unaffected_places > 0)
);

INSERT INTO maintenance (start_date, end_date, number_of_unaffected_places, nature, parking_id)
VALUES ('18/02/2022', '18/03/2022', null, 'mise en conformité - sécurité', 2),
('17/05/2023', '18/09/2024', 15, 'agrandissement', 1);

CREATE TABLE contract (
	id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	client text NOT NULL DEFAULT 'mairie de Dinard',
	provider text NOT NULL,
	price int NOT NULL,
	estimation_date date NOT NULL,
  maintenance_id int NOT NULL REFERENCES maintenance (id)
);

CREATE TABLE vehicle (
  id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  license_plate text NOT NULL UNIQUE
);

CREATE TABLE parking_vehicle (
  id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  parking_id int NOT NULL REFERENCES parking (id),
  vehicle_id int NOT NULL REFERENCES vehicle (id),
  enter_time timestamptz NOT NULL,
  exit_time timestamptz,
  CONSTRAINT visit_time_consistency CHECK (exit_time IS NULL OR enter_time < exit_time)
);

INSERT INTO vehicle (license_plate) VALUES ('DZ-650-TQ', 'YA-776-AL', 'AD-310-YO');

INSERT INTO parking_vehicle (parking_id, vehicle_id, enter_time, exit_time) VALUES
(1, 1, '2022-02-17 18:01:45', null),
(1, 2, '2022-02-17 18:07:35', '2022-02-17 23:47:01'),
(4, 3, '2022-02-17 19:11:04', null);
