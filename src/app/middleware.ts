import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  // Crear cliente de Supabase para el middleware
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  
  // Verificar si hay una sesión activa
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Obtener la ruta actual
  const { pathname } = request.nextUrl;
  
  // Si el usuario intenta acceder a rutas protegidas sin sesión, redirigir al login
  if (pathname.startsWith('/admin') && !session) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }
  
  // Si el usuario va a login pero ya tiene sesión, redirigir al dashboard
  if (pathname.startsWith('/auth/login') && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  // Permitir peticiones a la página de setup siempre
  if (pathname.startsWith('/setup')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Ver las rutas que serán procesadas por el middleware
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/setup'],
}; 