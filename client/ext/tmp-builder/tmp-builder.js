/**
 * Code Editor for the Cloud9 IDE
 *
 * @copyright 2010, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

define(function(require, exports, module) {

    var ide = require("core/ide");
    var ext = require("core/ext");
    var editors = require("ext/editors/editors");
    var settings = require("ext/settings/settings");
    var panels = require("ext/panels/panels");
    var markup = require("text!ext/tmp-builder/tmp-builder.xml");   
    var css = require("text!ext/tmp-builder/tmp-builder.css");

    var appPath = '/workspace/app/';
    var browser = {};


    var TMPProperties = require("ext/tmp-builder/lib-tmpproperties");
//    var TMPEditor = require("ext/tmp-builder/tmp-editor");


//    dock implementation
    var dock = require("ext/dockpanel/dockpanel");

    module.exports = ext.register("ext/tmp-builder/tmp-builder", {
        name            : "TMP-Builder",
        dev             : "mwaysolutions.com",
        alone           : true,
        type            : ext.GENERAL,
        markup          : markup,
        css             : css,
        properties      : '',

        propertyChanged: function(data){
            console.log('JUHU', data);
            this.properties.update(data.data.data);
        },

        incomingEspressoMessage: function(message) {
            var msg = message;
            console.log('msg', message);
            if (msg && msg.subtype)
                console.log(msg.subtype);
            if(msg && msg.subtype && msg.subtype === 'propertyChange'){
                this.propertyChanged(msg);
            }
        },

        startEspresso: function() {
            ide.addEventListener("socketMessage", function() {
            });
//            start espresso server
            var cmd = 'espresso';
            var data = {
                command: "espresso",
                argv: ["espresso", "server"],
                line: "espresso server",
                cwd: ide.workspaceDir
            };

            ide.send(JSON.stringify(data));

            //            set the browser source
            browser = winTmpBuilder.getElementsByTagName('a:browser')[0];
            browser.setAttribute('src', 'http://127.0.0.1:8000/tmp_builder');
        },

//        event when this is bound to the GUI
        hook : function() {
//            import css
            apf.importCssString((this.css || ""));
//            register this to the panel
            panels.register(this);

            // fix to prevent Active Files button is placed above Project Files
            var el = (navbar.firstChild.class == "project_files") ? navbar.childNodes[1] : navbar.firstChild;
//            the panel button
            var btn = this.button = navbar.insertBefore(new apf.button({
                skin    : "mnubtn",
                state   : "true",
                class   : "tmp_builder",
                caption : "Builder-2"
            }), el);

            var _self = this;

//            register onClick callback
            btn.addEventListener("mousedown", function(e) {
                var value = this.value;
                if (navbar.current && (navbar.current != _self || value)) {
                    navbar.current.disable(navbar.current == _self);
                    if (value) {
                        return;
                    }
                }
                panels.initPanel(_self);
                _self.enable(true);
            });

//            dock implementation
            var name = "ext/tmp_builder/tmp_builder";
            dock.addDockable({
                hidden  : false,
                buttons : [
                    { caption: "TMP properties", ext : [name, "tmpProperties"] }
                ]
            });

            dock.register(name, "tmpProperties", {
                menu : "TMP-Builder/TMP-Properties",
                primary : {
                    backgroundImage: "/static/style/images/tmp-builder-dock-icon.png",
                    defaultState: { x: 0, y: -0 },
                    activeState: { x: 0, y: -0 }
                }
            }, function(type) {
                ext.initExtension(_self);
                return tmpProperties;
            });

//            socketMessages
            ide.addEventListener("socketMessage", function(e) {
                if (e && e.message) {
                    var message = e.message;

                    if ((message.type && message.type != "themproject")) {
                        return;
                    }
                    _self.incomingEspressoMessage(message);
                }
            });
        },

//        on first call
        init : function() {
            this.panel = winTmpBuilder;

            this.properties = new TMPProperties("cloud9", tmpProperties);

            var _self = this;
//            append the browser: winTmpBuilder is defined in tmp-builder.xml
            colLeft.appendChild(winTmpBuilder);

            _self.startEspresso();


            sendEspressoMessage = function(argv, message, type) {

                ide.send(JSON.stringify({
                        "argv"        : argv ? argv : '',
                        "line"        : argv ? argv.join(' ') : '',
                        "cwd"         : ide.workspaceDir
                    }));

                return;
                if (ide && ide.socket && ide.socket.json) {
                    console.log('sendable');
                    ide.socket.json.send({
                        "message"     : message ? message : "",
                        "argv"        : argv ? argv : '',
                        "line"        : argv ? argv.join(' ') : '',
                        "cwd"         : ide.workspaceDir
                    });
                }
            }

            sendEspressoMessage();
        },

//        when the plugin gets used
        enable : function(noButton) {
            if (self.winTmpBuilder) {
//                the path to the current source code
//                TODO path must be set dynamically
//                removed that - because we can't identify the corresponding file
//                var path = appPath + 'new_main.js';
//                show the source file
//                editors.showFile(path, 0, 0);
                //ide.dispatchEvent("track_action", {type: "fileopen"});
//                show the browser
                winTmpBuilder.show();
            }


//            show the browser space
            colLeft.show();
            if (!noButton) {
                this.button.setValue(true);
                if (navbar.current && (navbar.current != this))
                    navbar.current.disable(false);
            }
//            the resize window bar
            splitterPanelLeft.show();
            navbar.current = this;

//            reload the browser
            if (browser) {
                browser.reload();
            }
        },

        disable : function(noButton) {
            if (self.winTmpBuilder)
                winTmpBuilder.hide();
            if (!noButton)
                this.button.setValue(false);
            splitterPanelLeft.hide();
        },

        destroy : function() {
            panels.unregister(this);
            tabTmpBuilder.destroy(true, true);
        }
    });

//    TODO REMOVE SECOND PARAMETER
}, '');
