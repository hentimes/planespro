/**
 * GOOGLE APPS SCRIPT - PLANESPRO V2 CORREGIDO
 * Alineado con encabezados actuales de Google Sheets (16 columnas)
 */

const CONFIG = {
  SPREADSHEET_ID: '1upx-bLBGxEyMCcYIS_QwPY5zLrbQCZ1M-9LW9utZCQI',
  SHEET_NAME: 'Leads Isapre V3'
};

const HEADERS = [
  'timestamp',
  'nombre',
  'telefono',
  'email',
  'isapre_actual',
  'num_cargas',
  'rango_costo',
  'perfil_recomendado',
  'servicio',
  'source',
  'button_source',
  'version',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'ip_address'
];

function doPost(e) {
  try {
    const data = e.parameter;
    const timestamp = new Date();

    const rowData = [
      timestamp,
      data.nombre || '',
      data.telefono || '',
      data.email || '',
      data.isapre_actual || '',
      data.num_cargas || '',
      data.rango_costo || '',
      data.perfil_recomendado || '',
      data.servicio || 'Análisis Isapre Personalizado',
      data.source || '',
      data.button_source || '',
      data.version || '4',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || '',
      data.ip_address || 'web_client'
    ];

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }

    sheet.appendRow(rowData);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}