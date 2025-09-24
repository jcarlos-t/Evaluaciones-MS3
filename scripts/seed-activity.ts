// scripts/seed-activity.ts
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { connectMongo } from '../src/db/mongo'; // O la ubicación correcta de tu archivo mongo.ts
import ActivityLog from '../src/models/activityLog'; // Asegúrate de que la ruta sea correcta

// Conectar a la base de datos
async function seedActivityLogs() {
  await connectMongo(); // Conecta a MongoDB

  console.log("Generando actividad para 20,000 logs...");

  // Generar ≥20,000 documentos
  const docs = [];
  const numberOfDocs = 20000; // ≥20k documentos

  for (let i = 0; i < numberOfDocs; i++) {
    const activity = {
      actorUid: faker.datatype.uuid(), // Genera un UUID para el estudiante
      type: faker.helpers.arrayElement(["LESSON_VIEW", "QUIZ_ATTEMPT", "SUBMISSION_CREATE", "ENROLLMENT_STATE"]),
      courseRunUid: faker.datatype.uuid(),
      lessonUid: faker.datatype.uuid(),
      meta: {
        lessonName: faker.commerce.productName(),
        score: faker.datatype.number({ min: 1, max: 100 }),
      },
      at: faker.date.recent(90), // Fecha aleatoria dentro de los últimos 90 días
    };

    docs.push(activity);

    if (i % 1000 === 0) {
      console.log(`Generados ${i} registros...`);
    }
  }

  // Insertar los documentos en MongoDB
  try {
    await ActivityLog.insertMany(docs); // Insertamos todos los documentos de una vez
    console.log("¡Datos generados exitosamente!");
  } catch (error) {
    console.error("Error insertando datos:", error);
  }

  // Verificar que la inserción fue exitosa con countDocuments
  const count = await ActivityLog.countDocuments();
  console.log(`Se han insertado ${count} documentos en la colección "activity_logs".`);
  process.exit(0);
}

seedActivityLogs().catch((err) => {
  console.error("Error al ejecutar el script:", err);
  process.exit(1);
});

