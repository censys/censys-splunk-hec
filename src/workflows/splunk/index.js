// index.js

let collectors = ['censys'];
let emitters = ['splunk_hec'];

async function initialize(){

    await _g.components.initWorkflowObject(this);


    const userAgent = _g.components.userAgent(this.name);
    this.censys = new this.collectors.censys( {...this.settings.censys.authentication, userAgent: userAgent} );

    this.splunk_hec = new this.emitters.splunk_hec(this.settings.splunk);

}

module.exports = class {

    constructor(name) {
        this.name = name;
        this.collectors = collectors;
        this.emitters = emitters;
        this.initialize = initialize;
    } 
}
