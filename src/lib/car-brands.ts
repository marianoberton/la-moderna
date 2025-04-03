// Data structure for common car brands and their models in Argentina
export interface CarModel {
  id: string;
  name: string;
}

export interface CarBrand {
  id: string;
  name: string;
  models: CarModel[];
}

export const carBrands: CarBrand[] = [
  {
    id: "volkswagen",
    name: "Volkswagen",
    models: [
      { id: "amarok", name: "Amarok" },
      { id: "gol", name: "Gol Trend" },
      { id: "golf", name: "Golf" },
      { id: "nivus", name: "Nivus" },
      { id: "polo", name: "Polo" },
      { id: "taos", name: "Taos" },
      { id: "tcross", name: "T-Cross" },
      { id: "tiguan", name: "Tiguan" },
      { id: "virtus", name: "Virtus" },
      { id: "vento", name: "Vento" }
    ]
  },
  {
    id: "toyota",
    name: "Toyota",
    models: [
      { id: "corolla", name: "Corolla" },
      { id: "corollacross", name: "Corolla Cross" },
      { id: "etios", name: "Etios" },
      { id: "hilux", name: "Hilux" },
      { id: "rav4", name: "RAV4" },
      { id: "sw4", name: "SW4" },
      { id: "yaris", name: "Yaris" }
    ]
  },
  {
    id: "chevrolet",
    name: "Chevrolet",
    models: [
      { id: "cruze", name: "Cruze" },
      { id: "onix", name: "Onix" },
      { id: "prisma", name: "Prisma" },
      { id: "s10", name: "S10" },
      { id: "tracker", name: "Tracker" },
      { id: "trailblazer", name: "Trailblazer" }
    ]
  },
  {
    id: "ford",
    name: "Ford",
    models: [
      { id: "bronco", name: "Bronco" },
      { id: "ecosport", name: "EcoSport" },
      { id: "f150", name: "F-150" },
      { id: "fiesta", name: "Fiesta" },
      { id: "focus", name: "Focus" },
      { id: "ka", name: "Ka" },
      { id: "kuga", name: "Kuga" },
      { id: "maverick", name: "Maverick" },
      { id: "mondeo", name: "Mondeo" },
      { id: "ranger", name: "Ranger" },
      { id: "territory", name: "Territory" }
    ]
  },
  {
    id: "renault",
    name: "Renault",
    models: [
      { id: "alaskan", name: "Alaskan" },
      { id: "captur", name: "Captur" },
      { id: "duster", name: "Duster" },
      { id: "kangoo", name: "Kangoo" },
      { id: "kwid", name: "Kwid" },
      { id: "logan", name: "Logan" },
      { id: "sandero", name: "Sandero" },
      { id: "stepway", name: "Stepway" }
    ]
  },
  {
    id: "fiat",
    name: "Fiat",
    models: [
      { id: "argo", name: "Argo" },
      { id: "cronos", name: "Cronos" },
      { id: "fiorino", name: "Fiorino" },
      { id: "mobi", name: "Mobi" },
      { id: "pulse", name: "Pulse" },
      { id: "strada", name: "Strada" },
      { id: "toro", name: "Toro" }
    ]
  },
  {
    id: "peugeot",
    name: "Peugeot",
    models: [
      { id: "2008", name: "2008" },
      { id: "208", name: "208" },
      { id: "308", name: "308" },
      { id: "3008", name: "3008" },
      { id: "408", name: "408" },
      { id: "5008", name: "5008" },
      { id: "expert", name: "Expert" },
      { id: "partner", name: "Partner" }
    ]
  },
  {
    id: "citroen",
    name: "Citroën",
    models: [
      { id: "berlingo", name: "Berlingo" },
      { id: "c3", name: "C3" },
      { id: "c4cactus", name: "C4 Cactus" },
      { id: "c4lounge", name: "C4 Lounge" },
      { id: "c5aircross", name: "C5 Aircross" },
      { id: "jumpy", name: "Jumpy" }
    ]
  },
  {
    id: "nissan",
    name: "Nissan",
    models: [
      { id: "frontier", name: "Frontier" },
      { id: "kicks", name: "Kicks" },
      { id: "note", name: "Note" },
      { id: "sentra", name: "Sentra" },
      { id: "versa", name: "Versa" },
      { id: "xtrail", name: "X-Trail" }
    ]
  },
  {
    id: "honda",
    name: "Honda",
    models: [
      { id: "civic", name: "Civic" },
      { id: "crv", name: "CR-V" },
      { id: "fit", name: "Fit" },
      { id: "hrv", name: "HR-V" },
      { id: "wr-v", name: "WR-V" }
    ]
  },
  {
    id: "jeep",
    name: "Jeep",
    models: [
      { id: "compass", name: "Compass" },
      { id: "gladiator", name: "Gladiator" },
      { id: "renegade", name: "Renegade" },
      { id: "wrangler", name: "Wrangler" }
    ]
  },
  {
    id: "otra",
    name: "Otra",
    models: [
      { id: "otro", name: "Otro" }
    ]
  }
];

// Función para obtener modelos según la marca seleccionada
export function getModelsByBrand(brandId: string): CarModel[] {
  const brand = carBrands.find(b => b.id === brandId);
  return brand ? brand.models : [];
} 