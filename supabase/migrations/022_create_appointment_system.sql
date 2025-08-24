-- #############################################################################
-- ##      SCRIPT DE BASE DE DATOS PARA EL SISTEMA DE AGENDAMIENTO            ##
-- #############################################################################

-- ### PASO 1: DEFINIR TIPO DE ESTADO PARA LAS CITAS ###
CREATE TYPE public.appointment_status AS ENUM ('CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- ### PASO 2: CREAR TABLA DE DISPONIBILIDAD DE ASESORES (`advisor_availability`) ###
-- Aquí, cada admin define sus horarios de trabajo semanales.
CREATE TABLE public.advisor_availability (
    id SERIAL PRIMARY KEY,
    admin_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Domingo, 1=Lunes, etc.
    start_time TIME NOT NULL, -- Ej: '09:00:00'
    end_time TIME NOT NULL, -- Ej: '17:00:00'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.advisor_availability IS 'Define los horarios de trabajo de los asesores (admins).';

-- ### PASO 3: CREAR TABLA DE CITAS AGENDADAS (`appointments`) ###
-- Aquí se guardará cada cita que un prospecto agende.
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    admin_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL, -- Fecha y hora exacta de inicio
    end_time TIMESTAMPTZ NOT NULL, -- Fecha y hora exacta de fin
    status public.appointment_status NOT NULL DEFAULT 'CONFIRMADA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.appointments IS 'Almacena las citas agendadas por los prospectos.';