const { createReadStream, createWriteStream } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, '/styles');
const pathToNewFile = path.join(__dirname, '/project-dist/bundle.css');

const createBundle = async () => {
    try {
        const writeableStream = createWriteStream(pathToNewFile);

        const files = await readdir(pathToFolder, { withFileTypes: true });

        files.forEach(async (file) => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const stream = createReadStream(path.join(pathToFolder, file.name));

                stream.on('data', (data) => {
                    writeableStream.write(data);
                });
                
                stream.on('error', (error) => {
                    console.log(error);
                });
            }
        });

    } catch (err) {
        console.error(err);
    }
}

createBundle();
