// Tipos para sucursales
export type Representative = {
  name: string;
  position: string;
  phone: string;
};

export type Branch = {
  id: number;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapUrl: string;
  representatives: Representative[];
};

// Datos de las sucursales
export const branches: Branch[] = [
  {
    id: 1,
    name: 'La Moderna T. Lauquen',
    address: 'Av. Garcia Salinas 1163',
    phone: '+54 9 11 5464-5940',
    whatsapp: "5491154645940",
    email: 'tlauquen@lamoderna.com.ar',
    mapUrl: 'https://maps.app.goo.gl/zje7j5rAYgpR8y6eA',
    representatives: [
      { name: 'Juan Pablo', position: 'Asesor Comercial', phone: '+54 9 11 5464-5940' }
    ]
  },
  {
    id: 2,
    name: 'La Moderna Pehuajo',
    address: 'Acceso Pres. Nestor C. Kirchner 1151',
    phone: '+54 9 2396 62-5108',
    whatsapp: "5492396625108",
    email: 'pehuajo@lamoderna.com.ar',
    mapUrl: 'https://maps.app.goo.gl/GzocjPT9PH4EZJjK6',
    representatives: [
      { name: 'Franco', position: 'Asesor Comercial', phone: '+54 9 2396 62-5108' }
    ]
  }
]; 