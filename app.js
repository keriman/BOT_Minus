const spreadsheet = require('./spreadsheet')
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; 
const year = currentDate.getFullYear();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowGracias = addKeyword(['Gracias', 'gracias', 'grax', 'grx', 'bye', 'adios'])
    .addAnswer('Hasta pronto!', {
    delay: 1000,
})

const flowReserva = addKeyword(['Reservar', 'reservar', 'Reserva', 'reserva', 'reservacion', 'reservación', 'Reservacion', 'Reservación'])
  .addAnswer(
    ['¡Excelente!', 'Para reservar necesitamos unos datos...', '¿A *Nombre* de quién es la reservación?', ' (Nombre y Apellido)'],
    null,
    null
  )
  .addAnswer(
    ['👇🏼'],
    { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
    async (ctx, { flowDynamic, endFlow }) => {
      if (ctx.body === '❌ Cancelar solicitud') {
        return endFlow({
          body: '❌ Su solicitud ha sido cancelada ❌',
          buttons: [{ body: '⬅️ Volver al Inicio' }]
        });
      } else {
        nombre = ctx.body;
        await flowDynamic(`Encantado *${nombre}*, continuamos...\n¿En qué fecha deseas asistir?\n(día/mes/año)`);
      }
    }
  )
  .addAnswer(
    ['👇🏼'],
    { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
    async (ctx, { flowDynamic, endFlow }) => {
      if (ctx.body === '❌ Cancelar solicitud') {
        return endFlow({
          body: '❌ Su solicitud ha sido cancelada ❌',
          buttons: [{ body: '⬅️ Volver al Inicio' }]
        });
      } else {
        fecha = ctx.body;
        await flowDynamic(`Perfecto *${nombre}*, continuamos...\n¿Cuántas personas asistirán?\n(Números únicamente)`);
      }
    }
  )
  .addAnswer(
    ['👇🏼'],
    { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
    async (ctx, { flowDynamic, endFlow }) => {
      if (ctx.body === '❌ Cancelar solicitud') {
        return endFlow({
          body: '❌ Su solicitud ha sido cancelada ❌',
          buttons: [{ body: '⬅️ Volver al Inicio' }]
        });
      } else {
        px = ctx.body;
        await flowDynamic(`Excelente *${nombre}* \n¿Cuál será su hora de llegada?`);
      }
    }
  )
  .addAnswer(
    ['👇🏼'],
    { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
    async (ctx, { flowDynamic, endFlow }) => {
      if (ctx.body === '❌ Cancelar solicitud') {
        return endFlow({
          body: '❌ Su solicitud ha sido cancelada ❌',
          buttons: [{ body: '⬅️ Volver al Inicio' }]
        });
      } else {
        hr = ctx.body;
        await flowDynamic(`Perfecto *${nombre}* \nAhora déjame un número de contacto \n(Número a 10 dígitos)`);
      }
    }
  )
  .addAnswer(
    ['👇🏼'],
    { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
    async (ctx, { flowDynamic, endFlow }) => {
      if (ctx.body === '❌ Cancelar solicitud') {
        return endFlow({
          body: '❌ Su solicitud ha sido cancelada ❌',
          buttons: [{ body: '⬅️ Volver al Inicio' }]
        });
      } else {
        tel = ctx.body;
        await flowDynamic(`Perfecto! Y ya por último...\n¿Celebras algún evento en particular (cumpleaños, aniversario, etc)?`);
      }
    }
  )
  .addAnswer(
    ['👇🏼'],
    { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
    async (ctx, { flowDynamic, endFlow }) => {
      if (ctx.body === '❌ Cancelar solicitud') {
        return endFlow({
          body: '❌ Su solicitud ha sido cancelada ❌',
          buttons: [{ body: '⬅️ Volver al Inicio' }]
        });
      } else {
        observaciones = ctx.body;
        nomFol = nombre.substring(0, 3).toUpperCase();
        telFol = tel.substring(6, 10);

        const pObject = {
          Folio: 'Baby' + telFol + nomFol + '/' + px,
          Fecha: day + '/' + month + '/' + year,
          Hora_mensaje: hours + ':' + minutes + ':' + seconds,
          Nombre: nombre,
          Personas: px,
          Llegada: hr,
          Telefono: tel,
          Asistencia: fecha,
          RP: 'BabyBOT',
          Observaciones: observaciones,
          Estado: 'Pendiente',
        };

        await spreadsheet.guardarReserva(pObject);

        await flowDynamic(`Estupendo! Aquí te dejo el resumen de tu reservación:
- Nombre: *${nombre}*
- Fecha: *${fecha}*
- Hora: *${hr}*
- Personas: *${px}*
- Teléfono: *${tel}*
- Evento: *${observaciones}*
`);
      }
    }
  )
  .addAnswer(
    ['Para volver al menú principal escribe *Inicio* o simplemente escribe *gracias* para salir!'],
    null,
    null
  )
  .addAnswer(
    ['O presiona el botón de abajo 👇🏼 para volver al menú principal'],
    { capture: true, buttons: [{ body: '🏠 Inicio' }] }
  );

const flowVerificar = addKeyword(['Verificar'])
  .addAnswer(
    ['En base a tu número de teléfono', 'aquí te dejo el resumen de tu reservación:'],
    null,
    async (ctx, { flowDynamic }) => {
      if (tel) {
        await flowDynamic(`    - Nombre: *${nombre}*
- Fecha: *${fecha}*
- Hora: *${hr}*
- Personas: *${px}*
- Teléfono: *${tel}*
- Evento: *${observaciones}*
`);
      } else {
        await flowDynamic('¡UPS! No encontramos información relacionada a este número de teléfono.');
      }
    }
  )
  .addAnswer(
    ['Presiona el botón de abajo para volver al menú principal o simplemente escribe gracias!'],
    { capture: true, buttons: [{ body: '🏠 Inicio' }] }
  );


const flowPrincipal = addKeyword(['hola', 'ole', 'alo', '🏠 Inicio','⬅️ Volver al Inicio','inicio','Inicio'])
    .addAnswer('👋🏼 Hola! Bienvenido a *Babylon*')
    .addAnswer('Para hacer una reservación, escribe la palabra 👉🏼 *Reservar*')
    .addAnswer(
        [
            'O en su defecto 👇🏼 presiona en cualquiera de los botónes según lo necesites.',
        ],
        {
            capture: true, 
            buttons: [{ body: 'Reservar' }, { body: 'Verificar' }]},
        null,
        [flowReserva, flowVerificar, flowGracias]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
