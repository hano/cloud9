define(
        function(require, exports, module) {

            var TMPProperties = module.exports = function(namespace, page) {
                console.log('TMPProperties init');
                this.propertiesPage = page;
                this.initialize();
                this.counter = 1;
            };

            (function() {

                this.initialize = function() {
                    var textbox = new apf.hbox({
                        /*flex   : "true",
                        width   : "tmp_builder",
                        value : "Builder-2",
                        realtime : "true"*/
                    });

                    this.propertiesPage.appendChild(textbox);

                    //<a:textbox flex="1" width="90%" smartbinding="sbExample" value="[@name]" realtime="true"/>
                }

                this.update = function(data) {
                    var that = this;
                    var x = 0;
//                    this.propertiesPage.childNodes.forEach(function(obj) {
//                        obj.removeNode();
//                        console.log('length', that.propertiesPage.childNodes.length);
//                    });

                    var xml = apf.json2Xml(data);
                    console.log(xml);
                    XML = xml;
                    mdlTmpProperties.load(xml.xml);


                    var hbox = new apf.hbox({});

                    Object.keys(data).forEach(function(key, index) {

                        hbox.appendChild(new apf.textbox({
                            flex   : "true",
                            value : key + ' - ' + data[key] + ' - ' + x,
                            realtime : "true"
                        }));
                    });

                    this.propertiesPage.appendChild(hbox);

                };
            }).call(TMPProperties.prototype = new apf.Class().$init());

        })
        ;