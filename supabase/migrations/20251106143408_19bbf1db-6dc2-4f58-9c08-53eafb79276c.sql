-- Remove a política antiga de insert que impede o primeiro admin
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Permite inserir role de 'user' para qualquer usuário autenticado
CREATE POLICY "Users can insert their own user role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND role = 'user'
);

-- Permite inserir role de 'admin' apenas se:
-- 1. Não existe nenhum admin ainda (primeiro admin), OU
-- 2. O usuário que está inserindo já é admin
CREATE POLICY "Can insert admin role if no admin exists or user is admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND role = 'admin'
  AND (
    NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
    OR has_role(auth.uid(), 'admin')
  )
);

-- Adiciona você como admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('b30f835a-2e1f-4934-b811-30ec13294673', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;