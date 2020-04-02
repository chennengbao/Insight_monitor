/* 
 * @Author: 陈能堡 - Rising Tide
 * @GitHub: https://github.com/chennengbao
 * @Date:   2016-12-08 19:06:07
 * @Last Modified by:   梦幻雪冰
 * @Last Modified time: 2017-07-24 11:42:46
 *
 * @config 配置信息
 * @deviceInfo 设备信息
 * @pagePerformanceData 页面性能数据
 * @dataStorage 数据临时存储区
 * @init() 初始化
 * @monitorElement() 数据监测
 * @getEleInfo() 根据标签类型获取标签信息
 * @filterData() 过滤空的数据 
 * @getSiblingsEle() 获取元素的兄弟级
 * @getContent() 获取标签的内容
 * @trim() 去除字符串首尾空格
 * @sendData()发送数据
 * @newRequest() 创建请求
 * @createUUID() 生成UUID
 * @createUvId() 生成UvId
 * @setCookie() 设置cookie
 * @getCookie() 获取cookie
 * @getTimesTamp() 生成时间戳
 * @addEvent() 绑定事件
 * @removeEvent() 移除事件
 * @getEvent() 事件对象
 * @getTarget() 目标对象
 * @extend() 扩展对象
 * @getPerformanceTiming() 获取网页性能数据
 */
!function() {
    /*****************配置信息存储区*****************/ 
    var config = {
        // 请求的图片地址
        requestImgSrc: 'http://10.0.0.206:9980/img/tz.gif',
        // cookie的有效时间
        expires: 315360000000
    }

    /*****************设备信息存储区*****************/ 
    var deviceInfo = {
        siteId: 0,
        pvId: 0,
        uvId: 0,
        dateTime: 0,
        // 设备是否支持cookie
        cookieEnabled: navigator.cookieEnabled,
        // 浏览器使用的语言
        language: navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "",
        // 屏幕大小
        screenSize: (window.screen.width || 0) + "x" + (window.screen.height || 0),
        // 设备像素比
        dpi: window.devicePixelRatio,
        // 设备的颜色位数
        colorDepth: window.screen.colorDepth,
        // 运行平台
        platform: ((/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && 'mobile') || (/(Android)/i.test(navigator.userAgent) && 'Android') || 'PC'),
        requestType: 0
    }

    /*****************页面性能数据*****************/ 
    var pagePerformanceData = {
        siteId: 0,
        pvId: 0,
        uvId: 0,
        // 网页加载完成的时间
        loadPage: 0,
        // 解析DOM结构的时间
        domReady: 0,
        // 重定向时间
        redirect: 0,
        // DNS查询时间
        lookupDomain: 0,
        // TTFB
        ttfb: 0,
        // 内容加载的完成时间
        request: 0,
        // 执行onload回调函数的时间
        loadEvent: 0,
        // DNS缓存时间
        cache: 0,
        // 卸载页面的时间
        unLoadEvent: 0,
        // TCP建立连接完成握手时间
        connect: 0,
        requestType: 1      
    }

    /*****************脚本异常数据*****************/ 
    var errorData = {
        //错误的具体信息
        msg: '',  
        //错误所在的url
        url: '',  
        //错误所在的行
        line: '',
        //错误所在的列
        col: '',  
        //具体的error对象
        error: '' 
    };
    /*****************监测数据存储区*****************/ 
    var dataStorage = {
        siteId: 0,
        pvId: 0,
        uvId: 0,
        pageTitle: escape(document.title),
        nodeName: '',
        propType: '',
        propName: '',
        propId: '',
        propClass: '',
        propVal: '',
        propText: '',
        dateTime: 0,
        referer: document.referrer,
        requestType: 2
    }

    /*****************监测功能*****************/
    function Domob() {
        // 初始pvid
        _setting_.pvId = this.createUUID();
    }

    /*
     * [init 初始化]
     * @return {[type]} [description]
     */
    Domob.prototype.init = function(){
        var _this = this;

        this.createUvId();
        this.monitorElement();

        this.addEvent(window, 'load', function() {
            setTimeout(function() {
                // 发送页面性能数据
                _this.getPerformanceTiming();
                _this.sendData(pagePerformanceData);  
            }, 5000);

            // 标记pvid
            deviceInfo.pvId = _setting_.pvId;
            // 发送设备信息
            _this.sendData(deviceInfo);         
        });

    };

    /*
     * [monitorElement 数据监测]
     * @return {[type]} [description]
     */
    Domob.prototype.monitorElement = function() {
        var _this = this;

        // 监测用户点击的元素
        function comEventHandler(e) {
            var targetEle = _this.getTarget(e);

            // 过滤标签类型
            if ((new RegExp('(^|\|)' + targetEle.nodeName + '(\||$)', 'i').exec(_setting_.monitorEle.join('|')))) {
              // 收集标签信息
              _this.getEleInfo(targetEle);
              _this.sendData(dataStorage);              
            };
        }

        // 页面关闭监测
        // function unloadEventHandler() {
        //   _this.sendData({
        //     eTime: +new Date
        //   }); 
        // }

        // 鼠标操作
        this.addEvent(document, 'click', comEventHandler);
        // 页面关闭监测
        // this.addEvent(window, 'unload', unloadEventHandler);
    }

    /*****************辅助功能*****************/ 
    /*
     * [getEleInfo 根据标签类型获取标签信息]
     * @param  {[type]} eleObj [description]
     * @return {[type]}        [description]
     */
    Domob.prototype.getEleInfo = function(eleObj) {
        var eleType     = eleObj.type,
            nodeName    = eleObj.nodeName.toLowerCase();   

        dataStorage.nodeName = nodeName;
        dataStorage.propType = eleType;
        dataStorage.propName = eleObj.name;
        dataStorage.propId = eleObj.id;
        dataStorage.propClass = eleObj.className
        dataStorage.propText = this.getContent(eleObj);

        switch(nodeName) {
            case 'button': 
                dataStorage.propText = this.getContent(eleObj); 
                break;
            case 'input': 
                if (eleType != 'text' && eleType != 'password') {
                    dataStorage.propText = this.trim(eleObj.value); 
                    if (eleObj.type == 'checkbox' || eleObj.type == 'radio') {
                        dataStorage.propText = this.getContent(this.getSiblingsEle(eleObj, 'label')[0]);
                    }                 
                };
                break;
            case 'textarea': 
                dataStorage.propText = ''; 
                break;
            case 'select': 
                dataStorage.propText = this.getContent(eleObj.options[eleObj.selectedIndex]); 
                dataStorage.propVal = this.trim(eleObj.value);
                break;
        }   

        // 过滤数据
        this.filterData();
    }

    /*
     * [filterData 过滤空的数据]
     * @return {[type]}         [字符串]
     */
    Domob.prototype.filterData = function() {
        for(var data in dataStorage) {
            if (!dataStorage[data]) {
                delete dataStorage[data];
            };
        }
    }

    /*
     * [getSiblingsEle 获取元素的兄弟级]
     * @param  {[type]} eleObj  [标签对象]
     * @param  {[type]} eleType [标签类型]
     * @return {[type]}         [标签对象]
     */
    Domob.prototype.getSiblingsEle = function(eleObj, eleType) {
        var eleArr      = eleObj.parentNode.childNodes,
            len         = eleArr.length,
            reslutArr   = [];

        for (var i = 0; i < len; i++) {
            if (eleArr[i].nodeName.toLowerCase() == eleType) {
                reslutArr.push(eleArr[i]);
            };
        };
        
        return reslutArr;
    }
    /*
     * [getContent 获取标签的内容]
     * @param  {[type]} eleObj [标签的对象]
     * @return {[type]}        [标签的内容]
     */
    Domob.prototype.getContent = function(eleObj) {
        // 火狐兼容处理
        return escape(eleObj.textContent ? this.trim(eleObj.textContent) : this.trim(eleObj.innerText));
    }

    /*
     * [trim 去除字符串首尾空格]
     * @param  {[type]} str [字符串]
     * @return {[type]}     [字符串]
     */
    Domob.prototype.trim = function(str) {
      return str.replace(/^\s+|\s+$/g, '');
    }

    /*
     * [sendData 发送数据]
     * @param  {[type]} paramStr [description]
     * @return {[type]}          [description]
     */
    Domob.prototype.sendData = function(paramObj) {
        var _this = this;

        var result = this.extend(paramObj, {
            siteId: _setting_.siteId,
            pvId: _setting_.pvId,
            uvId: _setting_.uvId,
            dateTime: _this.getTimesTamp()
        });

        this.newRequest(JSON.stringify(result));
    }

    /*
     * [newRequest 创建请求]
     * @param  {[type]} para [对象]
     * @return {[type]}      [description]
     */
    Domob.prototype.newRequest = function (paramStr) {
        var img = new Image(),
            id = 'monitor_cnb_' + this.getTimesTamp();

        // 存储在全局变量，防止浏览器回收内存的时候请求发不出去
        window[id] = img;
        img.onload = img.onerror = img.onabort = function() {
            img.onload = img.onerror = img.onabort = null;
            img = window[id] = null;
        }
        img.src = config.requestImgSrc + '?cache=' + this.getTimesTamp() + '&data=' + paramStr;

        console.warn('发送数据' + config.requestImgSrc + '?cache=' + this.getTimesTamp() + '&data=' + paramStr);
    }

    /*
     * [createUUID 生成UUID]
     * @return {[type]} [UUID的值]
     * @参考资料：https://github.com/LiosK/UUID.js
     */
    Domob.prototype.createUUID = function() {
        generate = function() {
          var rand = _getRandomInt, hex = _hexAligner;
          return  hex(rand(32), 8)          
                + "-"
                + hex(rand(16), 4)         
                + "-"
                + hex(0x4000 | rand(12), 4) 
                + "-"
                + hex(0x8000 | rand(14), 4)
                + "-"
                + hex(rand(48), 12);        
        };

        _getRandomInt = function(x) {
          if (x <   0) return NaN;
          if (x <= 30) return (0 | Math.random() * (1 <<      x));
          if (x <= 53) return (0 | Math.random() * (1 <<     30))
                            + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
          return NaN;
        };

        _getIntAligner = function(radix) {
          return function(num, length) {
            var str = num.toString(radix), i = length - str.length, z = "0";
            for (; i > 0; i >>>= 1, z += z) { if (i & 1) { str = z + str; } }
            return str;
          };
        };

        _hexAligner = _getIntAligner(16);

        return generate();
    }

    /*
     * [createUvId 生成UvId]
     * @return {[type]} [description]
     */
    Domob.prototype.createUvId = function() {
        var uvid = this.getCookie('uvId');

        if (uvid) {
            _setting_.uvId = uvid;
        } else {
            _setting_.uvId = this.createUUID();
            this.setCookie('uvId', _setting_.uvId, config.expires);
        }
    }

    /*
     * [setCookie 设置cookie]
     * @param {[type]} cookieName [cookie的name值]
     */
    Domob.prototype.setCookie = function(cookieName, value, expires) {
        var nowDate = new Date();

        nowDate.setTime(nowDate.getTime() + expires);
        document.cookie = cookieName + '=' + value + ';path=/;expires=' + nowDate.toGMTString(); 
    }

    /*
     * [getCookie 获取cookie]
     * @param  {[type]} cookieName [cookie的name值]
     * @return {[type]}            [返回cookie的值]
     */
    Domob.prototype.getCookie = function(cookieName) {
        var cookieStr   = document.cookie,
            result      = [];

        return (result = new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)").exec(cookieStr)) ? result[2] : null;;
    }

    /*
     * [getTimesTamp 生成时间戳]
     * @return {[字符串]} [时间戳]
     */
    Domob.prototype.getTimesTamp = function() {
        return (new Date()).getTime();
    }

    /*
     * [addEvent 绑定事件]
     * @param {[type]}   obj       [标签对象]
     * @param {[type]}   eventName [事件类型]
     * @param {Function} fn        [处理函数]
     * @return {[type]}            [null]
     */
    Domob.prototype.addEvent = function(obj, eventName, fn){
        if (obj.addEventListener) {
            obj.addEventListener(eventName, fn, false);
        } else{
            obj.attachEvent("on" + eventName, function(){
                // this指向改成标签对象
                fn.call(obj);
                return fn;
            })
        };
    }

    /*
     * [removeEvent 移除事件]
     * @param  {[type]}   obj       [标签对象]
     * @param  {[type]}   eventName [事件类型]
     * @param  {Function} fn        [处理函数]
     * @return {[type]}             [null]
     */
    Domob.prototype.removeEvent = function(obj, eventName, fn){
        if (obj.removeEventListener) {
            obj.removeEventListener(eventName, fn, false);
        } else {
            obj.detachEvent('on' + eventName, fn);
        }
    }

    /*
     * [getEvent 事件对象]
     * @param  {[type]} e [事件对象]
     * @return {[type]}   [事件对象]
     */
    Domob.prototype.getEvent = function(e) {
        return e || window.event;
    }

    /*
     * [getTarget 目标对象]
     * @param  {[type]} e [事件对象]
     * @return {[type]}   [事件目标对象]
     */
    Domob.prototype.getTarget = function(e) {
        var event = this.getEvent(e);

        return event.target || event.srcElement;
    }

    /*
     * [extend 扩展对象]
     * @return {[type]} [null]
     */
    Domob.prototype.extend = function(target) {
        if (target === null || target === undefined) {
            console.log('Cannot conver undefined or null to object!');
        };

        var targetData = Object(target),
            len = arguments.length;

        // 遍历参数个数
        for (var index = 1; index < len; index++) {
            // 遍历对象属性
            var source = arguments[index];
            for (var key in source) {
                // 判断对象中非原型链中的属性
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    targetData[key] = source[key];
                };
            };
        };

        return targetData;
    }

    /*
     * [getPerformanceTiming 获取网页性能数据]
     * @return {[type]} [description]
     */
    Domob.prototype.getPerformanceTiming = function() {
        var performance = window.performance;

        if (!performance) {
            console.info('你的浏览器不支持 performance 接口');
            return;
        };

        var t = performance.timing;

        // 网页加载完成的时间
        pagePerformanceData.loadPage = t.loadEventEnd - t.navigationStart;
        // 解析DOM结构的时间
        pagePerformanceData.domReady = t.domComplete - t.responseEnd;
        // 重定向时间
        pagePerformanceData.redirect = t.redirectEnd - t.redirectStart;
        // DNS查询时间
        pagePerformanceData.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
        // TTFB
        pagePerformanceData.ttfb = t.responseStart - t.navigationStart;
        // 内容加载的完成时间
        pagePerformanceData.request = t.responseEnd - t.responseStart;
        // 执行onload回调函数的时间
        pagePerformanceData.loadEvent = t.loadEventEnd - t.loadEventStart;
        // DNS缓存时间
        pagePerformanceData.cache = t.domainLookupStart - t.fetchStart;
        // 卸载页面的时间
        pagePerformanceData.unLoadEvent = t.unloadEventEnd - t.unloadEventStart;
        // TCP建立连接完成握手时间
        pagePerformanceData.connect = t.connectEnd - t.connectStart;
    }

    /*****************实例化*****************/ 
    var domob = new Domob();
    domob.init();

    /*
     * [onerror 前端代码异常监控]
     * @param  {[type]} msg   [description]
     * @param  {[type]} url   [description]
     * @param  {[type]} col   [description]
     * @param  {[type]} error [description]
     * @return {[boolean]}    [true]
     */
    window.onerror = function(msg, url, line, col, error) {
        // 非脚本错误和空的url不进行上报数据
        if (msg != 'Script error.' && !url) {
            // return true;
        };

        // 采用异步的方式,避免阻塞
        setTimeout(function() {
            // 处理兼容IE10-
            col = col || (window.event && window.event.errorCharacter) || 0;
            // 发生错误对应的脚本路径
            errorData.url = url;
            // 错误发生的行号
            errorData.line = line;
            // 错误发生的列号
            errorData.col = col;

            if (error && error.stack) {
                // 如果浏览器有堆栈信息，直接使用
                errorData.msg = error.stack.toString();
            } else if(arguments.callee) {
                //  arguments.callee.caller 可以递归出调用堆栈
                var data = [];
                var f = arguments.callee.caller, c = 3;

                // 只获取三层堆栈信息
                while(f && (--c > 0)) {
                    data.push(f.toString());

                    if (f === f.caller) {
                        // 递归调用就退出
                        break;
                    };

                    f = f.caller;
                }

                data = data.join(',');
                errorData.msg = error.stack.toString();
            }

            // 发送数据
            domob.sendData(errorData);  
        }, 0);

        return true;
    }
}();

