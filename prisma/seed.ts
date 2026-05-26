import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: [
      {
        name: "Habitación N°7",
        type: "Simple",
        description: "Habitación cómoda y discreta, ideal para una pausa breve. Bluetooth, TV y aire acondicionado.",
        pricePerNight: 38000,
        capacity: 2,
        amenities: "Cama Queen,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=1200&q=80"
      },
      {
        name: "Habitación N°13",
        type: "Simple con cochera",
        description: "Acceso directo por cochera privada. Ambiente íntimo con paleta cálida y madera natural.",
        pricePerNight: 43000,
        capacity: 2,
        amenities: "Cochera privada,Cama Queen,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80"
      },
      {
        name: "Habitación N°15",
        type: "Con cochera e hidro",
        description: "Hidromasaje privado, espejo de pared completa e iluminación LED regulable.",
        pricePerNight: 48000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=80"
      },
      {
        name: "Habitación N°20",
        type: "Con cochera e hidro",
        description: "Suite con hidromasaje, paredes acolchadas y ambientación sensorial. Climatización individual.",
        pricePerNight: 48000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80"
      },
      {
        name: "Habitación N°23",
        type: "Con cochera e hidro",
        description: "Hidromasaje doble, vidriado floor-to-ceiling y aislación acústica reforzada.",
        pricePerNight: 48000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80"
      },
      {
        name: "Habitación Premier N°30",
        type: "Premier con hidro",
        description: "Top del hotel. Hidromasaje, cochera, room service incluido y ambientación premium.",
        pricePerNight: 55000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Room service incluido,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C,Insonorizada",
        imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80"
      }
    ]
  });

  console.log("✓ Seed Ruta Hotel completo — 6 habitaciones cargadas");
}

main().finally(() => prisma.$disconnect());
