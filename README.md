 # Mirai-Generator
Mirai-Generator
> 该说明文件旨在让会开发和不会开发的人都能尽量读懂。

## 创建Mcl阶段
> 原则上需要使用Mirai Console Loader来创建mirai-api-http。现在已经是创建好的模板
1. 将java 17配置到环境变量。
2. 进入mcl文件夹里面打开运行mcl.cmd的命令文件。
3. 在mcl.cmd中运行不报错，并且在最后显示有关mcl started的文字就说明配置成功。

## 配置Mcl阶段
1. 定位到mcl->config->net.mamoe.mmirai-api-http->setting.yml文件
2. 将setting.yml中的account后面的数字替换成你要登录的qq,password下面的pwd修改为密码。注意：不要破坏任何结构，不要添加和删除任何空格。

## 启动Mcl阶段
1. 再次运行mcl.cmd,注意弹窗。进入设备锁验证或者根据提示链接来验证。验证成功后关闭弹窗，在命令行窗口中查看是否登录成功。
   1. 出现滑动解锁：将上面的链接复制到浏览器，打开开发者工具，然后滑动滑块，成功后在开发者工具的网络中找到域名为 'https://t.captcha.qq.com/cap_union_new_verify' 的请求
   2. 点击后在响应中找到ticket，然后复制（不包括双引号）到弹窗的下面一个输入框，回车。
   3. ，出现设备锁：点击设备锁验证，然后扫码或另外一种，看到成功提示后退出，然后退出弹窗。
2. 保持Mcl命令行窗口不关闭，项目则处于启动状态。

现在，你已经启动了Mirai并配置好了mirai-http。

接下来关于机器人的功能由mirai-circle来完成。

### 版本
* [Mcl](https://github.com/iTXTech/mirai-console-loader/releases/tag/v1.2.2)

