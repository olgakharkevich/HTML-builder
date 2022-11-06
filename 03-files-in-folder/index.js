const { readdir, stat } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, '/secret-folder');

const readFiles = async () => {
    try {
      const files = await readdir(pathToFolder, { withFileTypes: true });

      files.forEach(async (file) => {
          if (file.isFile()) {  
           const stats = await stat(path.join(pathToFolder, file.name));
           console.log(`${file.name} - ${path.extname(file.name)} - ${stats.size}b`);
        }
      });
    } catch (err) {
      console.error(err);
    }
}

readFiles();
