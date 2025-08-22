-- ### PASO 1: LIMPIEZA PREVIA ###
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.propiedad_alfa CASCADE;
DROP TABLE IF EXISTS public.propiedad_alfa_details CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.fraction_status CASCADE;
DROP TYPE IF EXISTS public.document_category CASCADE;
DROP TYPE IF EXISTS public.contract_status CASCADE;

-- ### PASO 2: DEFINIR TIPOS PERSONALIZADOS (ENUMS) ###
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'COPROPIETARIO', 'PROSPECTO', 'PENDIENTE');
CREATE TYPE public.fraction_status AS ENUM ('DISPONIBLE', 'RESERVADA', 'VENDIDA');
CREATE TYPE public.document_category AS ENUM ('LEGAL', 'FINANCIERO', 'REGLAMENTO', 'REPORTE', 'CONTRATO', 'PROSPECTO');
CREATE TYPE public.contract_status AS ENUM ('BORRADOR', 'ENVIADO', 'FIRMADO', 'CANCELADO');

-- ### PASO 3: CREAR TABLAS ###

-- Almacena los perfiles de todos los usuarios de la plataforma.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    role public.user_role NOT NULL DEFAULT 'PENDIENTE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contiene la información de marketing y características de la Propiedad Alfa.
CREATE TABLE public.propiedad_alfa_details (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    project_name TEXT NOT NULL DEFAULT 'Propiedad Alfa',
    location_text TEXT NOT NULL DEFAULT 'Tulum Country Club',
    total_fractions INT NOT NULL DEFAULT 20,
    construction_start_date DATE,
    estimated_delivery_date DATE,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    fraction_initial_price NUMERIC(12, 2),
    contract_details TEXT, -- Cambiado de 'fideicomiso_details'
    prospectus_document_id UUID, -- Se vinculará a la tabla 'documents'
    description TEXT,
    amenities JSONB,
    media_gallery JSONB
);

-- Gestiona el estado y propiedad de las 20 fracciones de la Propiedad Alfa.
CREATE TABLE public.propiedad_alfa (
    fraction_number INT PRIMARY KEY CHECK (fraction_number >= 1 AND fraction_number <= 20),
    status public.fraction_status NOT NULL DEFAULT 'DISPONIBLE',
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Repositorio para todos los archivos.
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    category public.document_category NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gestiona los contratos legales de compra-venta.
CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    fraction_id INT NOT NULL REFERENCES public.propiedad_alfa(fraction_number),
    document_id UUID UNIQUE REFERENCES public.documents(id),
    status public.contract_status NOT NULL DEFAULT 'BORRADOR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ### PASO 4: POBLAR DATOS INICIALES ###
INSERT INTO public.propiedad_alfa_details (id, fraction_initial_price) VALUES (1, 1000000.00);
INSERT INTO public.propiedad_alfa (fraction_number) SELECT generate_series(1, 20);

-- ### PASO 5: CREAR LA FUNCIÓN Y EL TRIGGER DE AUTOMATIZACIÓN ###
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, first_name, last_name, email)
    VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();