(self || window).FunctionWorker = function (scriptName) {
    this.scriptName = scriptName;
    this.threadedFunction = function (func, onfinished, callback) {
        var worker = new Worker(this.scriptName);
        worker.addEventListener('message', function (e) {
            var f=e.data;
//            eval("f=" + JSON.parse(e.data));

            switch (f.state) {
                case 'callback':
                    callback && callback(f);
                    break;
                case 'finished':
                    onfinished && onfinished(f);
                    break;
            }
        }, false);
        var script = "(function (_e) { (" + func.toString() + ")(_e);})";
        
        var toSend = "{ caller: " + script + " }";
        worker.postMessage(toSend); // Send data to our worker.
    };
    return this;
};

self.addEventListener('message', function (e) {
    var f;
    eval("f=" + e.data);
    var aj; 
    eval("aj=({ callback: function (j) { self.postMessage({data:j,state:'callback'}); }, data: 0}); (" + f.caller + ")(aj);");
    self.postMessage({ data: aj.data, state: 'finished' });
}, false);

 