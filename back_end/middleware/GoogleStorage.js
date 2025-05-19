import { Storage } from '@google-cloud/storage';
import { Error } from '../utils/Error.js'
import { nanoid } from 'nanoid';
import 'dotenv/config.js';

//google storage
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucket = storage.bucket(process.env.BUCKET_NAME);


export function upLoad(req, res, next) {
    try {

        if (!req.files) {
            return next(new Error(400, 'Nessun file caricato.'))
        }

        const file = req.files['image'][0]

        const blob = bucket.file(nanoid());


        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: { contentType: file.mimetype }
        });

        blobStream.on('error', err => {
            console.log(err);
            return next(new Error(500, 'Errore durante l’upload'));
        });

        blobStream.on('finish', () => {
            req.profilepicUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
            next();
        });

        // scrivi il buffer nel bucket
        blobStream.end(file.buffer);



    } catch (err) {
        console.error('Internal error:', err);
        return next(new Error(500, 'Errore durante l’upload'));
    }

}

