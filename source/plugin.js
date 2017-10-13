module.exports = function(plugins){
    if(!plugins) return (m, loadFile) => loadFile(m);

    return async function({name:maybeModule, requiredBy}, loadFile){
        if(maybeModule.indexOf('!') < 0){
            return await loadFile({maybeModule, requiredBy});
        }

        const [plugin, name] = maybeModule.split('!');
        if(plugin in plugins){
            return await plugins[plugin]({name, requiredBy}, loadFile);
        }else{
            throw new Error(`Unknown plugin while trying to load ${plugin}!${name}`);
        }
    }
}
