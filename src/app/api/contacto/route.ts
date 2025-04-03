import { NextRequest, NextResponse } from "next/server";
import { createConsulta } from "@/services/consultaService";

export async function POST(request: NextRequest) {
  try {
    // Verificar configuración de entorno
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "El servidor no está configurado correctamente" },
        { status: 503 }
      );
    }
    
    const body = await request.json();
    
    // Validación básica
    if (!body.nombre || !body.email || !body.telefono || !body.mensaje || !body.sucursal) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }
    
    // Formatear los datos para el servicio
    const consultaData = {
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono,
      mensaje: body.mensaje,
      sucursal: body.sucursal,
      vehiculo: body.vehiculo || undefined
    };
    
    // Guardar en la base de datos
    const consulta = await createConsulta(consultaData);
    
    return NextResponse.json(
      { success: true, message: "Consulta enviada correctamente", id: consulta.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al procesar consulta:", error);
    
    return NextResponse.json(
      { error: "Error al procesar la consulta", details: error.message },
      { status: 500 }
    );
  }
} 