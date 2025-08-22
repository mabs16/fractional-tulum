# Estructura de Base de Datos - Fractional Tulum

## 1. Información del Proyecto

**Nombre:** Fractional Tulum by Hole in One\
**Proyecto Supabase:** gyxxhshzzfvpvucsoaop\
**URL:** <https://gyxxhshzzfvpvucsoaop.supabase.co>

## 2. Descripción General

Este documento contiene la estructura completa de la base de datos para la plataforma de propiedad fraccional de la "Propiedad Alfa" en Tulum. La base de datos está diseñada para manejar:

* Gestión de usuarios (Prospectos, Copropietarios, Administradores)

* Control de las 20 fracciones de la propiedad

* Repositorio de documentos legales y financieros

* Contratos de compra-venta

* Información detallada del proyecto inmobiliario

## 3. Script SQL Completo

**INSTRUCCIONES DE EJECUCIÓN:**

1. Acceder al SQL Editor de Supabase
2. Crear una nueva consulta
3. Copiar y pegar el siguiente script completo
4. Ejecutar el script

```sql
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
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        email,
        avatar_url -- Añadimos la columna avatar_url al INSERT
    )
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url' -- Leemos el avatar desde los metadatos del proveedor
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 4. Descripción de Tipos Personalizados (ENUMS)

### 4.1 user\_role

* **ADMIN**: Administradores del sistema con acceso completo

* **COPROPIETARIO**: Usuarios que poseen una o más fracciones

* **PROSPECTO**: Usuarios interesados en comprar fracciones

* **PENDIENTE**: Usuarios recién registrados sin rol asignado

### 4.2 fraction\_status

* **DISPONIBLE**: Fracción disponible para compra

* **RESERVADA**: Fracción reservada temporalmente

* **VENDIDA**: Fracción vendida y con propietario asignado

### 4.3 document\_category

* **LEGAL**: Documentos legales del proyecto

* **FINANCIERO**: Estados financieros y reportes económicos

* **REGLAMENTO**: Reglamentos internos y normas

* **REPORTE**: Reportes de avance y construcción

* **CONTRATO**: Contratos de compra-venta

* **PROSPECTO**: Documentos de marketing y prospectos

### 4.4 contract\_status

* **BORRADOR**: Contrato en proceso de creación

* **ENVIADO**: Contrato enviado al comprador

* **FIRMADO**: Contrato firmado y válido

* **CANCELADO**: Contrato cancelado

## 5. Descripción de Tablas

### 5.1 profiles

**Propósito**: Almacena los perfiles de todos los usuarios de la plataforma.

**Campos principales**:

* `user_id`: Referencia al usuario de autenticación de Supabase

* `first_name`, `last_name`: Nombres del usuario

* `email`: Correo electrónico único

* `role`: Rol del usuario en el sistema

* `avatar_url`: URL de la foto de perfil

* `phone`: Número telefónico

### 5.2 propiedad\_alfa\_details

**Propósito**: Contiene la información de marketing y características de la Propiedad Alfa.

**Campos principales**:

* `id`: Siempre 1 (tabla singleton)

* `project_name`: Nombre del proyecto

* `location_text`: Ubicación textual

* `total_fractions`: Total de fracciones (20)

* `fraction_initial_price`: Precio inicial por fracción

* `contract_details`: Detalles del contrato

* `amenities`: Amenidades en formato JSON

* `media_gallery`: Galería de medios en formato JSON

### 5.3 propiedad\_alfa

**Propósito**: Gestiona el estado y propiedad de las 20 fracciones de la Propiedad Alfa.

**Campos principales**:

* `fraction_number`: Número de fracción (1-20)

* `status`: Estado actual de la fracción

* `owner_id`: ID del propietario (si está vendida)

### 5.4 documents

**Propósito**: Repositorio para todos los archivos del sistema.

**Campos principales**:

* `file_name`: Nombre del archivo

* `storage_path`: Ruta de almacenamiento en Supabase Storage

* `category`: Categoría del documento

* `profile_id`: Usuario asociado al documento

### 5.5 contracts

**Propósito**: Gestiona los contratos legales de compra-venta.

**Campos principales**:

* `buyer_id`: ID del comprador

* `fraction_id`: Número de fracción asociada

* `document_id`: Documento del contrato

* `status`: Estado del contrato

## 6. Migraciones de Base de Datos

### 6.1 Lista de Migraciones

* **001\_create\_fractional\_tulum\_structure.sql**: Estructura inicial completa de la base de datos

* **002\_enable\_rls\_security\_policies.sql**: Habilitación de Row Level Security (RLS)

* **003\_contracts\_access\_policies.sql**: Políticas de acceso para contratos

* **004\_public\_security\_with\_views.sql**: Seguridad pública con vistas

* **005\_fix\_anonymous\_public\_access.sql**: Corrección de acceso público anónimo

* **006\_update\_handle\_new\_user\_avatar.sql**: **NUEVA** - Captura automática de avatares sociales

### 6.2 Migración 006: Captura de Avatar Social

**Propósito**: Actualizar la función `handle_new_user` para capturar automáticamente las URLs de avatar de proveedores sociales (Google, Apple, etc.) durante el registro de usuarios.

**Funcionalidad**:

* Extrae `avatar_url` desde `raw_user_meta_data` de Supabase Auth

* Guarda automáticamente la foto de perfil del proveedor social

* Mantiene compatibilidad con registro manual (avatar\_url será NULL)

* Mejora la experiencia de usuario con fotos de perfil instantáneas

## 7. Automatización

### 7.1 Trigger de Nuevos Usuarios (Actualizado)

Cuando un usuario se registra en Supabase Auth, automáticamente se crea un perfil en la tabla `profiles` con:

* Rol inicial: 'PENDIENTE'

* Información básica extraída de los metadatos de registro

* **Avatar automático mejorado**: Si el usuario se registra con un proveedor social (Google, Apple, etc.), la URL de su foto de perfil se captura automáticamente desde `raw_user_meta_data->>'avatar_url'`

* **Compatibilidad completa**: Funciona tanto para registro social como manual

**Función actualizada**:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        email,
        avatar_url -- Captura automática de avatar
    )
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url' -- Desde proveedores sociales
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 8. Datos Iniciales

Al ejecutar el script se crean:

* 1 registro en `propiedad_alfa_details` con precio inicial de $1,000,000.00

* 20 fracciones en `propiedad_alfa` (numeradas del 1 al 20) con estado 'DISPONIBLE'

## 9. Verificación Post-Ejecución

Después de ejecutar el script, verificar que se crearon:

* 4 tipos personalizados (enums)

* 5 tablas principales

* 1 función de trigger actualizada (con captura de avatar)

* 1 trigger automático

* 21 registros iniciales (1 en details + 20 fracciones)

**Verificación adicional de la función actualizada**:

* Ir a Database → Functions en Supabase

* Hacer clic en `handle_new_user`

* Confirmar que incluye `avatar_url` en INSERT y VALUES

* Probar registro social para verificar captura automática de avatar

