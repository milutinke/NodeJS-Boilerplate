// Libraries
const FileSystem = require('fs');
const Path = require('path');

class AutoRouter {
    constructor(RoutesPath, App) {
        this.App = App;
        this.loadRoute(Path.join(process.cwd(), RoutesPath));
    }

    loadRoute(path) {
        FileSystem.readdirSync(path).forEach(file => {
            let currentFullPath = Path.join(path, file);

            // Skip non .js files and skip this file, if the file is directory, then load routes from it recursivly
            if (file.slice(-3) !== '.js' || file === 'index.js') {
                if (FileSystem.statSync(currentFullPath).isDirectory())
                    this.loadRoute(currentFullPath);

                return;
            }

            // Require the route
            require(currentFullPath)(this.App);
        });
    }
}

// Exports
module.exports = (RoutesPath, App) => new AutoRouter(RoutesPath, App);