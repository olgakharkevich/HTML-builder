const { createReadStream, createWriteStream } = require('fs');
const { mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToDist = path.join(__dirname, 'project-dist');
const pathToIndex = path.join(pathToDist, 'index.html');
const pathToComponents = path.join(__dirname, 'components');

const createIndex = async () => {
    const readStream = createReadStream(pathToTemplate, 'utf8');

    readStream.on('data', async (data) => {
        const components = await readdir(pathToComponents, { withFileTypes: true });

        for (const component of components) {
            if (component.isFile() && path.extname(component.name) === '.html') {

                const componentReadStream = createReadStream(path.join(pathToComponents, component.name), 'utf8');
                
                componentReadStream.on('data', (content) => {
                    const componentName = path.basename(component.name, path.extname(component.name));
                    const regex = new RegExp(`{{${componentName}}}`, 'g') ;
                    data = data.replace(regex, content);
                    
                    createWriteStream(pathToIndex, 'utf8').write(data);
                });

                componentReadStream.on('error', (error) => {
                    console.log(error);
                });
            }
        }
    });
    
    readStream.on('error', (error) => {
        console.log(error);
    });
}

const createCssBundle = async (pathToStylesFolder, pathToBundle) => {
    try {
        const writeableStream = createWriteStream(pathToBundle);

        const files = await readdir(pathToStylesFolder, { withFileTypes: true });

        files.forEach(async (file) => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const stream = createReadStream(path.join(pathToStylesFolder, file.name));

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

const copyDir = async (pathSrc, pathTarget) => {
    try {
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

const buildPage = async () => {
    try {
        await mkdir(pathToDist, { recursive: true });
        await createIndex();
        await createCssBundle(path.join(__dirname, 'styles'), path.join(pathToDist, 'style.css'));
        await copyDir(path.join(__dirname, 'assets'), path.join(pathToDist, 'assets'));
    } catch (error) {
        console.error(error);
    }
}

buildPage();
