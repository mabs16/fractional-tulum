-- Verificar que la vista vista_publica_fracciones existe y funciona correctamente
SELECT 
    schemaname, 
    viewname, 
    definition 
FROM pg_views 
WHERE schemaname = 'public' 
    AND viewname = 'vista_publica_fracciones';

-- Probar la vista con una consulta SELECT
SELECT * FROM public.vista_publica_fracciones LIMIT 5;