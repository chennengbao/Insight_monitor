# WEB前端无埋点数据监测与上报 #
WEB前端无埋点监测/统计JavaScript SDK，参加黑客马拉松比赛作品，仅供学习使用——微信：cnb718747239
## author ##
[梦幻雪冰](https://github.com/chennengbao)

## 说明文档

1. siteId：站点id，用于区分站点
2. jsSrc：监测脚本地址
2. monitorEle：要监测的HTML标签类型
3. monitorXpath： 要监测的标签xpath，支持模糊与精准匹配
4. debug：提供给后端使用，false为调试状态，数据可丢弃

#### monitorXpath 说明
**1. 模糊匹配**

当前只支持两种；

第一种：/html/body/\*/textarea（父级或者祖父级无id的情况），\*用于表示忽略中间的层级

符合匹配要求：/html/body/div/div/textarea、/html/body/textarea等

第二种：//\*[@id="chennengbao"]/\*/div[1]/input[1]（父级或者祖父级有id的情况），\*用于表示忽略中间的层级

符合匹配要求：//\*[@id="chennengbao"]/section/article/div[1]/input[1]、//\*[@id="chennengbao"]/div[1]/input[1]等

**2. 精准匹配**

当前只支持两种；

第一种：/html/body/\*/textarea（父级或者祖父级无id的情况）

第二种：//\*[@id="id名"]/\*/div[1]/input[1]（父级或者祖父级有id的情况）

```javascript
<script>
    var _setting_ = {
        siteId: 18210246882,
        jsSrc: 'js/tidy.1.3.1.min.js',
        monitorEle: ['button', 'input', 'a', 'select', 'textarea', 'embed', 'i'],
        monitorXpath: {
            'alias1': '//*[@id="chennengbao"]/*/div[1]/input[1]',
            'alias2': '/html/body/*/textarea'
        },
        regXpath: [],
        debug: true // false为调试状态，数据可丢弃
    };
    (function() {
        var hm = document.createElement("script");
        hm.src = _setting_.jsSrc + '?' + Math.random();
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();
</script>
```

## update log

#### V1.3.2 ####
1. 修复已知问题

#### V1.3.1 ####
1. 增加xpath alias字段
2. xpath字段改成nodeXpath、filterXpath字段改成regXpath

#### V1.3.0 ####
1. 增加xpath、debug字段
2. 增加xpath方式过滤监测标签

#### V1.2.3 ####
1. 修复生成pvID规则问题

#### V1.2.2 ####
1. 增加requestType字段，0代表设备信息请求，1代表页面性能数据请求，2代表用户点击请求

#### V1.2.1 ####
1. 增加脚本异常捕获
2. 优化参数的格式化功能

#### V1.1.1 ####
1. 设备信息和网页性能信息增加UV、dateTime字段
2. 修复浏览器回收内存的时候数据请求发不出去的BUG

#### V1.1.0 ####
1. 调整referer、propText、propVal字段信息
2. 增加去除文本信息首尾空格的功能
3. 增加获取网页性能分析功能
4. 修复目前已知的BUG

#### V1.0.0 ####
1. PV、UV的统计
2. 用户点击元素的信息
3. 设备信息的统计
