# 前言
> 音乐播放器Demo是作者的开源项目[OneM](https://github.com/guangqiang-liu/OneM)中的一个功能，这里作者把播放器功能独立成项目，方便需要的同学参考学习。

# 预览效果图
![gif](http://upload-images.jianshu.io/upload_images/6342050-f4efcc2b6192ba0e.jpg?imageMogr2/auto-orient/strip)

# 播放器支持功能

* 支持播放 \ 暂停
* 支持三种播放模式，单曲循环、循序播放、随机播放
* 支持切换上一首、下一首
* 支持一首音频播放完成自动切换下一首
* 支持缓存播放及缓存进度
* 支持播放进度拖拽到指定位置播放

# 使用到的技术点

* 项目使用到`react-native-video`媒体播放组件
* 项目中用到的图标都是IconFont字体`react-native-vector-icons`，以及自定义的字体库
* 播放器背景使用了高斯模糊效果，使用到`react-native-blur`组件

# react-native-video 组件使用讲解

```
<Video source={{uri: "background"}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       rate={1.0}                              // 0 is paused, 1 is normal.
       volume={1.0}                            // 0 is muted, 1 is normal.
       muted={false}                           // Mutes the audio entirely.
       paused={false}                          // Pauses playback entirely.
       resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
       repeat={true}                           // Repeat forever.
       playInBackground={false}                // Audio continues to play when app entering background.
       playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
       ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
       progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
       onLoadStart={this.loadStart}            // Callback when video starts to load
       onLoad={this.setDuration}               // Callback when video loads
       onProgress={this.setTime}               // Callback every ~250ms with currentTime
       onEnd={this.onEnd}                      // Callback when playback finishes
       onError={this.videoError}               // Callback when video cannot be loaded
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
       style={styles.backgroundVideo} />
       
```

### Android拓展用法

```
<Video source={{uri: "background", mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version.
       rate={1.0}                   // 0 is paused, 1 is normal.
       volume={1.0}                 // 0 is muted, 1 is normal.
       muted={false}                // Mutes the audio entirely.
       paused={false}               // Pauses playback entirely.
       resizeMode="cover"           // Fill the whole screen at aspect ratio.
       repeat={true}                // Repeat forever.
       onLoadStart={this.loadStart} // Callback when video starts to load
       onLoad={this.setDuration}    // Callback when video loads
       onProgress={this.setTime}    // Callback every ~250ms with currentTime
       onEnd={this.onEnd}           // Callback when playback finishes
       onError={this.videoError}    // Callback when video cannot be loaded
       style={styles.backgroundVideo} />
```

**详细的`react-native-video`使用方法请参照官方文档：[https://github.com/react-native-community/react-native-video](https://github.com/react-native-community/react-native-video)**

# 使用 react-native-video 组件操作步骤
* `npm install react-native-video --save`
* `react-native link react-native-video --save`

# react-native-video 组件使用注意点

* 最好是网络请求到播放资源后再渲染 `Video` 组件

```
render() {
    const data = this.state.musicInfo || {}
    return (
      data.url ?
        <View style={styles.container}>
          <Image
            ref={(img) => { this.backgroundImage = img}}
            style={styles.bgContainer}
            source={{uri: data.cover}}
            resizeMode='cover'
            onLoadEnd={() => this.imageLoaded()}
          />
          <View style={styles.bgContainer}>
            {
              Platform.OS === 'ios' ?
                <VibrancyView
                  blurType={'light'}
                  blurAmount={20}
                  style={styles.container}/> :
                <BlurView
                  style={styles.absolute}
                  viewRef={this.state.viewRef}
                  blurType="light"
                  blurAmount={10}
                />
            }
          </View>
          {this.renderPlayer()}
        </View> : <View/>
    )
  }
  
```

* 播放CD胶盘旋转动画有bug，后续修复
* 切换音乐时，有白屏情况，后期修复
* 注意 `this.setTime()` 函数的使用，因为此函数调用频率很高。
* 注意播放器的各种状态机，处理好状态机的更新时机

# 项目简书地址
**[http://www.jianshu.com/p/7ddaf6ae9dd2](http://www.jianshu.com/p/7ddaf6ae9dd2)**

# 项目中使用到的高斯模糊和IconFont功能请参考下面的技术文档
* [高斯模糊](http://www.jianshu.com/p/a8664d39a16a)
* [自定义IconFont库](http://www.jianshu.com/p/9f6db8e38852)

# 总结
#####音乐播放器的功能实现还算是不太麻烦，很多功能 `react-native-video` 组价已经帮我们封装的很完善了，我们只需要调用即可。同学们在开发音频播放功能时，可能会遇到其他的问题，这时同学们好好查看官方文档。感觉文章对你有帮助，请 给个 *`star`* 给个 *`关注`* 谢谢。