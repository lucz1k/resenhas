import { google } from 'googleapis';
import { Readable } from 'stream';

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/drive.file']
);

const drive = google.drive({ version: 'v3', auth });

export async function salvarNoDrive(conteudo, nomeArquivo = 'resenha.txt') {
  const bufferStream = new Readable();
  bufferStream.push(conteudo);
  bufferStream.push(null);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: nomeArquivo,
        mimeType: 'text/plain',
        parents: process.env.GOOGLE_FOLDER_ID ? [process.env.GOOGLE_FOLDER_ID] : [],
      },
      media: {
        mimeType: 'text/plain',
        body: bufferStream,
      },
    });

    return response.data.id;
  } catch (err) {
    console.error('Erro ao salvar no Google Drive:', err);
    throw err;
  }
}
