const { Worker, Queue, QueueEvents, QueueScheduler } = require('bullmq');
const { exec } = require('child_process');
// const axios = require('axios');

require('dotenv').config();

const conn = {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_AUTH
    }
};

const worker = new Worker('xdio', async job => {
    console.log(`# Job started: ${job.id}`, job.data);
// fichier job.sh à traduire
// 1. axios ligne 11
// 2. valider la réponse
// 3. condition de conversion du fichier si c'est .m3u8
//  si oui, execSync pour ffmpeg
//  si non, axios pour récupérer le fichier .mp4
// 4. execSync ffmpeg avec le fichier .mp4
// 5. execSync time whisper
// 6. axios post retourner le résultat
// 7. console log $task
// 8 supprimer les fichiers
// return true



// b15b12efa3da3f9952d82d77ad855a0dd51864b3752c32a16988892fae5d8b86






// lignes 40 à 50 sont remplacés par la transposition ci-dessus
    return new Promise((resolve, reject) => {
        exec('./job.sh ' + job.data.hash + ' > xdio.log', (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error}`);
                reject(error);
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
            resolve({ stdout, stderr });
        });
    });
}, conn);

worker.on('completed', job => {
    console.log(`# Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
    console.log(`# Job failed: ${job.id} with ${err.message}`);
});

worker.on('error', (err) => {
    console.log(`# Worker error: ${err.message}`);
})

process.on('SIGINT', async () => {
    console.log('** Received SIGINT. Performing cleanup...');
    await worker.close();
    process.exit(0);
});

console.log("Worker is running and waiting for jobs.");
