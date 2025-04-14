import { NextRequest, NextResponse } from "next/server";
import { createConsulta } from "@/services/consultaService";

export async function POST(request: NextRequest) {
  try {
    console.log('Recibida solicitud de contacto - ' + new Date().toISOString());
    
    // Verificar configuración de entorno
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Error de configuración: Variables de entorno de Supabase no definidas');
      return NextResponse.json(
        { error: "El servidor no está configurado correctamente" },
        { status: 503 }
      );
    }
    
    // Obtener y validar el cuerpo de la solicitud
    const body = await request.json();
    console.log('Datos recibidos:', JSON.stringify(body));
    
    // Validación más detallada
    const camposRequeridos = ['nombre', 'email', 'mensaje'];
    const camposFaltantes = camposRequeridos.filter(campo => !body[campo]);
    
    if (camposFaltantes.length > 0) {
      console.warn(`Validación fallida: Faltan campos [${camposFaltantes.join(', ')}]`);
      return NextResponse.json(
        { 
          error: "Faltan campos requeridos", 
          campos: camposFaltantes 
        },
        { status: 400 }
      );
    }
    
    // Formatear los datos para el servicio
    const consultaData = {
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono || null,
      mensaje: body.mensaje,
      sucursal: body.sucursal || 'web',
      vehiculo: body.vehiculo || null
    };
    
    console.log('Intentando guardar consulta:', JSON.stringify(consultaData));
    
    // Guardar en la base de datos
    try {
      const consulta = await createConsulta(consultaData);
      console.log('Consulta guardada con éxito, ID:', consulta.id);
      
      return NextResponse.json(
        { 
          success: true, 
          message: "Consulta enviada correctamente", 
          id: consulta.id 
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error('Error específico al guardar consulta:', dbError);
      return NextResponse.json(
        { 
          error: "Error al guardar la consulta en la base de datos", 
          details: dbError.message 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error general al procesar consulta:", error);
    
    return NextResponse.json(
      { 
        error: "Error al procesar la consulta", 
        details: error.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 