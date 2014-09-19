var love = (function(){
    var u = {
        version:{
            name:"Elastic Love",
            author:"quininer",
            version:"0.0.1"
        },
        conf:{
            host:"<%= host %>",
            id:"<%= id %>"
        },
        run:{
            jsonp:{}
        }
    };

    u.op = {
        bind:function(e, name, foo){
            (e.addEventListener)?(
                e.addEventListener(name, foo, false)):(
                e.attachEvent('on'+name, foo));
        },
        random:function(i){return i?(Math.random().toString(36).slice(2)):(Math.random()*1e5)},

        ready:function(foo){
            if(document.onDOMContentLoaded){
                u.bind(document, 'DOMContentLoaded', foo);
            }else{
                var r = setInterval(function(){
                    try{
                        document.body.doScroll('left');
                        clearInterval(r);
                        foo();
                    }catch(e){};
                }, 5);
            };
        },

        hook:function(foo, hook){
            return function(){
                return (hook&&(typeof hook == 'function'))?(
                    Array.prototype.unshift.call(arguments, foo),
                    hook.apply(this, arguments)
                ):foo(arguments);
            };
        }
    };

    u.code = {
        enurl:function(datas, post){
            var uri = '';
            for(var data in datas){
                uri += (data+'='+encodeURIComponent(datas[data])+(post?';':'&'));
            }
            return uri.slice(0, -1);
        }
    },

    u.get = {
        isorigin:function(url, url2){
            var one = u.dom.create('a', {'href':url});
            var two = u.dom.create('a', {'href':url2||document.location.origin});
            return (
                (one.protocol == two.protocol)
                &&(one.hostname == two.hostname)
                &&(one.port == two.port)
            )?true:false;
        },
        testorigin:function(url){
            try{
                u.xhr.ajax(url);
            }catch(e){
                return (e.code != 19)?true:false;
            };
            return true;
        },

        isdom:function(e){return e.nodeType?true:false},
        id:function(name){return document.getElementById(name)},
        name:function(name){return document.getElementsByName(name)},
        tag:function(name){return document.getElementsByTagName(name)},
        class:function(name){return document.getElementsByClassName(name)},
        html:function(){return this.tag('html')[0]||(document.write('<html>')&this.tag('html')[0])}
    };

    u.dom = {
        inner:function(dom, hide, e){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            e = (e&&u.get.isdom(e))?e:u.get.html();
            var t = u.dom.create('div');
            t.innerHTML = dom;
            var i = t.children[0];
            (hide&&(typeof hide != 'function'))&&(i.style.display = 'none');
            (typeof callback == 'function')&&u.op.bind(i, 'load', callback);
            e.appendChild(i);
            return i;
        },

        create:function(tag, attr){
            var e = document.createElement(tag);
            for(i in attr){(typeof attr[i] == 'string')&&this.attr(e, i, attr[i])};
            return e;
        },
        insert:function(e, parent){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            parent = (parent&&u.get.isdom(parent))?parent:u.get.html();
            parent.appendChild(e);
            (typeof callback == 'function')&&callback(e, parent);
            return e;
        },
        add:function(tag, attr, parent){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            var e = this.create(tag, attr);
            this.insert(e, parent, callback);
            return e;
        },

        kill:function(e){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            u.get.isdom(e)&&e.parentNode.removeChild(e);
            (typeof callback == 'function')&&calback();
        },
        attr:function(e, attr, value){
            if(!value)return e.attributes[attr].value;
            e.setAttribute(attr, value);
            return e;
        }
    };

    u.load = {
        script:function(url){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            url += '?_=' + u.op.random();
            var script = u.dom.create('script', {'src':url});
            (typeof callback == 'function')&&u.bind(script, 'load', callback);
            u.dom.insert(script, function(e){
                u.dom.kill(e);
            });
        },
        import:function(){
            //TODO
            //根据json导入模块并传入参数执行
        }
    };

    u.xhr = {
        ajax:function(url, datas, headers){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            var type = (datas&&(typeof datas != 'function'))?'POST':'GET';
            var xhr = window.XMLHttpRequest?(new XMLHttpRequest()):(new ActiveXObject('Microsoft.XMLHTTP'));
            xhr.open(type, url, false);
            (type=='POST')&&(
                xhr.setRequestHeader('content-type','application/x-www-form-urlencoded'));
            if(headers&&(typeof headers != 'function')){
                for(var header in headers){
                    xhr.setRequestHeader(header, headers[header]);
                };
            };
            (typeof callback == 'function')&&(xhr.onreadystatechange = function(){
                ((this.readyState == 4)
                 &&(((this.status >= 200)
                     &&(this.status <= 300))
                         ||(this.status == 304))
                )&&callback.apply(this, arguments);
            });
            xhr.send((typeof datas == 'object')?u.code.enurl(datas):datas);
            return xhr;
        },

        json:function(url, callname){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            var json;
            if(callname&&(typeof callname != 'function')){
                var backname = 'i'+u.op.random(true);
                (typeof callback == 'function')&&(u.run.jsonp[backname] = u.op.hook(callback, function(callback, json){
                    callback(json);
                    delete u.run.jsonp[backname];
                }));
                u.load.script(url+'?'+callname+'=love.run.jsonp.'+backname+'&_='+u.op.random());
            }else{
                json = JSON.parse(this.ajax(url).responseText);
                (typeof callback == 'function')&&callback(json);
                return json;
            };
        },

        upload:function(){
            //TODO
            //基于ajax的表单上传
        }
    };
    u.socket = {
        conneted:{},
        connet:function(){
            //TODO
            //连接websocket
        }
    };

    u.req = {
        post:function(url, datas, jump){
            var callback = Array.prototype.slice.call(arguments, -1)[0];
            var form = u.dom.add('form', {
                'method':'POST',
                'style':'display: none;',
                'action':url,
            });
            if(datas&&(typeof datas == 'object')){
                for(var name in datas){
                    var input = u.dom.add('input', {
                        'name':name,
                        'value':datas[name]
                    }, form);
                };
            };
            if((!jump)||(typeof jump == 'function')){
                var iframe = u.dom.inner('<iframe sandbox name="'+u.op.random(true)+'">', true);
                u.dom.attr(form, 'target', iframe.name);
            };
            (typeof callback == 'function')&&u.op.bind(form, 'submit', callback);
            form.submit();
            ((!jump)||(typeof jump == 'function'))&&(u.dom.kill(form))&(setTimeout(function(){
                u.dom.kill(iframe);
            }, 3*1000));
        },
        upload:function(){
            //TODO
            //基于表单的文件上传
        }
    };

    return u;
})();
