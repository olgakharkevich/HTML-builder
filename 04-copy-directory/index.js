const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, '/files');
const pathToNewFolder = path.join(__dirname, '/files-copy');

const copyDir = async (pathSrc, pathTarget) => {
    try {
        await rm(pathToNewFolder, { force: true, recursive: true });
        await mkdir(pathTarget, { recursive: true });
        const files = await readdir(pathSrc, { withFileTypes: true });

        files.forEach(async (file) => {
            if (file.isDirectory()) {
                await copyDir(path.join(pathSrc, file.name), path.join(pathTarget, file.name));
            } else {
                await copyFile(path.join(pathSrc, path.basename(file.name)), path.join(pathTarget, path.basename(file.name)));
            }
        });

    } catch (err) {
        console.error(err);
    }
}

copyDir(pathToFolder, pathToNewFolder);
