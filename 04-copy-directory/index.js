const { mkdir, copyFile, readdir } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, '/files');
const pathToNewFolder = path.join(__dirname, '/files-copy');

const copyDir = async () => {
    try {
        await mkdir(pathToNewFolder, { recursive: true });
        const files = await readdir(pathToFolder, { withFileTypes: true });

        files.forEach(async (file) => {
            await copyFile(path.join(pathToFolder, path.basename(file.name)), path.join(pathToNewFolder, path.basename(file.name)));
        });

    } catch (err) {
        console.error(err);
    }
}

copyDir();
