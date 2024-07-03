const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const credenciales = require('./json/credencialesSheet.json');
const googeId = "1qYYU4yGVUfoj9LBtIzKbIOwkpagLRSz0ua5q1cTvsRo";

const serviceAccountAuth = new JWT({
    email: credenciales.client_email,
    key: credenciales.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function accederSheet() {
    const doc = new GoogleSpreadsheet(googeId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const registros = await sheet.getRows();
    return registros;
}

async function guardarReserva(pObjeto) {
    const doc = new GoogleSpreadsheet(googeId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(pObjeto);
}

module.exports = {
    accederSheet: accederSheet,
    guardarReserva: guardarReserva,
};
