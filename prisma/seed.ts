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
        description: "Discreción absoluta. Una pausa íntima sin pretensiones, con todas las comodidades esenciales.",
        pricePerNight: 38000,
        capacity: 2,
        amenities: "Cama Queen,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "/hotel/hab15-1.jpg"
      },
      {
        name: "Habitación N°13",
        type: "Simple con cochera",
        description: "Cochera privada. Llegás, entrás y nadie te ve. Ambiente cálido para un encuentro sin testigos.",
        pricePerNight: 43000,
        capacity: 2,
        amenities: "Cochera privada,Cama Queen,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "/hotel/hab15-2.jpg"
      },
      {
        name: "Habitación N°15",
        type: "Con cochera e hidromasaje",
        description: "Hidromasaje, luz tenue y un sillón blanco que parece flotar. Diseñada para perder la noción del tiempo.",
        pricePerNight: 48000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "/hotel/hab15-1.jpg"
      },
      {
        name: "Habitación N°20",
        type: "Con cochera e hidromasaje",
        description: "Suite con hidromasaje y ambientación sensorial. Climatización individual, aislación reforzada.",
        pricePerNight: 48000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "/hotel/hab23-2.jpg"
      },
      {
        name: "Habitación N°23",
        type: "Con cochera e hidromasaje",
        description: "Hidromasaje circular con luces de neón azul. Un escenario que mezcla privacidad y deseo.",
        pricePerNight: 48000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C",
        imageUrl: "/hotel/hab23-1.jpg"
      },
      {
        name: "Habitación Premier N°30",
        type: "Premier con hidromasaje",
        description: "Top del hotel. Hidromasaje, room service incluido y ambientación premium. La experiencia completa.",
        pricePerNight: 55000,
        capacity: 2,
        amenities: "Cochera privada,Hidromasaje,Room service incluido,Iluminación LED,Smart TV,Bluetooth,Frigobar,Wi-Fi,A/C,Insonorizada",
        imageUrl: "/hotel/hab23-2.jpg"
      }
    ]
  });

  console.log("✓ Seed Ruta Hotel — 6 habitaciones con fotos reales");
}

main().finally(() => prisma.$disconnect());
