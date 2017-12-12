/**
 * AudioPlayerDemo
 * 作者Git：https://github.com/guangqiang-liu
 * 技术交流群：620792950
 * 作者QQ：1126756952
 * @guangqiang
 */

import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image, Slider, Animated, Easing, Platform, findNodeHandle, Dimensions} from 'react-native'
import {commonStyle} from './commonStyle'
import Video from 'react-native-video'
import {VibrancyView, BlurView} from 'react-native-blur'
import {Icon} from './icon'

const mockData = require('./musicList.json')
const deviceInfo = {
  deviceWidth: Dimensions.get('window').width,
  deviceHeight: Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height - 24
}

const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const musicListUrl = 'http://v3.wufazhuce.com:8000/api/music/bymonth/2017-10'
const musicDetail = 'http://xiamirun.avosapps.com/run?song=http://www.xiami.com/song/'

export default class MusicPlayer extends Component {

  constructor(props) {
    super(props)
    this.player = ''
    this.rotation = false
    this.musicList = []
    this.state = {
      viewRef: null,
      paused: false, // false: 表示播放，true: 表示暂停
      duration: 0.00,
      slideValue: 0.00,
      currentTime: 0.00,
      currentIndex: 0,
      playMode: 0,
      spinValue: new Animated.Value(0),
      playIcon: 'music_paused_o',
      playModeIcon: 'music_cycle_o',
      musicInfo: {},
    }
    this.spinAnimated = Animated.timing(this.state.spinValue, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.linear)
    })
  }

  formatMediaTime(duration) {
    let min = Math.floor(duration / 60)
    let second = duration - min * 60
    min = min >= 10 ? min : '0' + min
    second = second >= 10 ? second : '0' + second
    return min + ':' + second
  }

  spining() {
    if (this.rotation) {
      this.state.spinValue.setValue(0)
      this.spinAnimated.start(() => {
        this.spining()
      })
    }
  }

  spin() {
    this.rotation = !this.rotation
    if (this.rotation) {
      this.spinAnimated.start(() => {
        this.spinAnimated = Animated.timing(this.state.spinValue, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.linear)
        })
        this.spining()
      })
    } else {
      this.state.spinValue.stopAnimation((oneTimeRotate) => {
        this.spinAnimated = Animated.timing(this.state.spinValue, {
          toValue: 1,
          duration: (1 - oneTimeRotate) * 6000,
          easing: Easing.inOut(Easing.linear)
        })
      })
    }
  }

  componentDidMount() {
    this.spin()
    this.setState({musicInfo: mockData.list[this.state.currentIndex]})
    // fetch(musicListUrl, {
    //   method: 'GET',
    //   headers: header
    // })
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     if (responseData.data[2].music_id) {
    //       this.musicList = responseData.data
    //       this.getxiamiMusic(responseData.data[0].music_id)
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    //   .done()
  }

  // getxiamiMusic(musicId) {
  //   fetch(`${musicDetail}${musicId}`, {
  //     method: 'GET',
  //     headers: header})
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       console.log(responseData)
  //       this.setState({musicList: this.musicList, musicInfo: responseData})
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  //     .done()
  // }

  setDuration(duration) {
    this.setState({duration: duration.duration})
  }

  setTime(data) {
    let sliderValue = parseInt(this.state.currentTime)
    this.setState({
      slideValue: sliderValue,
      currentTime: data.currentTime
    })
  }

  nextSong(currentIndex) {
    this.reset()
    this.setState({currentIndex: currentIndex >= mockData.list.length ? 0 : currentIndex})

    // currentIndex === this.state.musicList.length ? currentIndex = 0 : currentIndex
    // let newSong = this.state.musicList[currentIndex]
    // let music_id = newSong.music_id
    // if (!isNaN(parseInt(music_id))) {
    //   this.getxiamiMusic(music_id)
    //   this.setState({currentIndex})
    // } else {
    //   this.nextSong(currentIndex + 1)
    //   this.showMessageBar('抱歉')('没有找到音乐信息，已帮你切换到下一首')('error')
    // }
  }

  preSong(currentIndex) {
    this.reset()
    this.setState({currentIndex: currentIndex < 0 ? mockData.list.length - 1 : currentIndex})

    // currentIndex === -1 ? currentIndex = this.state.musicList.length -1 : currentIndex
    // let newSong = this.state.musicList[currentIndex]
    // let music_id = newSong.music_id
    // if (!isNaN(parseInt(music_id))) {
    //   this.getxiamiMusic(music_id)
    //   this.setState({currentIndex})
    // } else {
    //   this.preSong(currentIndex - 1)
    //   this.showMessageBar('抱歉')('没有找到音乐信息，已帮你切换到下一首')('error')
    // }
  }

  reset() {
    this.setState({
      currentTime: 0.00,
      slideValue: 0.00,
      musicInfo: {}
    })
  }

  play() {
    this.spin()
    this.setState({
      paused: !this.state.paused,
      playIcon: this.state.paused ? 'music_paused_o' : 'music_playing_s'
    })
  }

  playMode(playMode) {
    playMode ++
    playMode = playMode === 3 ? playMode = 0 : playMode
    switch (playMode) {
      case 0:
        this.setState({playMode, playModeIcon: 'music_cycle_o'})
        break
      case 1:
        this.setState({playMode, playModeIcon: 'music_single_cycle_o'})
        break
      case 2:
        this.setState({playMode, playModeIcon: 'music_random_o'})
        break
      default:
        break
    }
  }

  onEnd(data) {
    this.showMessageBar('亲！')('已帮你切换到下一首')('fuccess')
    if (this.state.playMode === 0) {
      this.nextSong(this.state.currentIndex + 1)
    } else if (this.state.playMode === 1) {
      this.player.seek(0)
    } else {
      this.nextSong(Math.floor(Math.random() * this.musicList.length))
    }
  }

  videoError(error) {title
    this.showMessageBar('播放器报错啦！')(error)('error')
  }

  showMessageBar = title => msg => type => {
    // 报错信息
  }

  renderPlayer() {
    // let musicInfo = this.state.musicInfo
    let musicInfo = mockData.list[this.state.currentIndex]
    return (
      <View style={styles.bgContainer}>
        <View style={styles.navBarStyle}>
          <View style={styles.navBarContent}>
            <TouchableOpacity
              style={{marginTop: 5}}
              onPress={() => alert('pop')}
            >
              <Icon name={'oneIcon|nav_back_o'} size={20} color={commonStyle.white}/>
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.title}>{musicInfo.title}</Text>
              <Text style={styles.subTitle}>子标题</Text>
            </View>
            <TouchableOpacity
              style={{marginTop: 5}}
              onPress={() => alert('分享')}
            >
              <Icon name={'oneIcon|share_o'} size={20} color={commonStyle.white}/>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={styles.djCard}>
        </View>
        <Image
          style={{width: 260, height: 260, alignSelf: 'center', position: 'absolute', top: 190}}
          source={require('./bgCD.png')}
        />
        <Animated.Image
          style={{
            width: 170,
            height: 170,
            borderRadius: 85,
            alignSelf: 'center',
            position: 'absolute', top: 235,
            transform: [{rotate: this.state.spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })}]
          }}
          source={{uri: musicInfo.cover}}/>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 50, justifyContent: 'space-around', bottom: -60}}>
            <Icon name={'oneIcon|love_o'} size={20} color={commonStyle.white}/>
            <Icon name={'oneIcon|downLoad_o'} size={20} color={commonStyle.white}/>
            <Icon name={'oneIcon|comment_o'} size={20} color={commonStyle.white}/>
            <Icon name={'oneIcon|more_v_o'} size={20} color={commonStyle.white}/>
          </View>
          <View style={styles.progressStyle}>
            <Text style={{width: 35, fontSize: 11, color: commonStyle.white, marginLeft: 5}}>{this.formatMediaTime(Math.floor(this.state.currentTime))}</Text>
            <Slider
              style={styles.slider}
              value={this.state.slideValue}
              maximumValue={this.state.duration}
              minimumTrackTintColor={commonStyle.themeColor}
              maximumTrackTintColor={commonStyle.iconGray}
              step={1}
              onValueChange={value => this.setState({currentTime: value})}
              onSlidingComplete={value => this.player.seek(value)}
            />
            <View style={{width: 35, alignItems: 'flex-end', marginRight: 5}}>
              <Text style={{fontSize: 11, color: commonStyle.white}}>{this.formatMediaTime(Math.floor(this.state.duration))}</Text>
            </View>
          </View>
          <View style={styles.toolBar}>
            <TouchableOpacity
              style={{width: 50, marginLeft: 5}}
              onPress={() => this.playMode(this.state.playMode)}
            >
              <Icon name={`oneIcon|${this.state.playModeIcon}`} size={16} color={commonStyle.white}/>
            </TouchableOpacity>
            <View style={styles.cdStyle}>
              <TouchableOpacity
                onPress={() => this.preSong(this.state.currentIndex - 1)}
              >
                <Icon name={'oneIcon|music_pre_o'} size={35} color={commonStyle.white}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: 35, height: 35, borderRadius: 20, borderWidth: 1, borderColor: commonStyle.white, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => this.play()}
              >
                <Icon name={`oneIcon|${this.state.playIcon}`} size={20} color={commonStyle.white}/>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.nextSong(this.state.currentIndex + 1)}
              >
                <Icon name={'oneIcon|music_next_o'} size={25} color={commonStyle.white}/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{width: 50, alignItems: 'flex-end', marginRight: 5}}
            >
              <Icon name={'oneIcon|menu_h_o'} size={20} color={commonStyle.white}/>
            </TouchableOpacity>
          </View>
        </View>
        <Video
          ref={video => this.player = video}
          source={{uri: musicInfo.url}}
          volume={1.0}
          paused={this.state.paused}
          playInBackground={true}
          onLoadStart={this.loadStart}
          onLoad={data => this.setDuration(data)}
          onProgress={(data) => this.setTime(data)}
          onEnd={(data) => this.onEnd(data)}
          onError={(data) => this.videoError(data)}
          onBuffer={this.onBuffer}
          onTimedMetadata={this.onTimedMetadata}/>
      </View>
    )
  }

  imageLoaded() {
    this.setState({viewRef: findNodeHandle(this.backgroundImage)})
  }

  render() {
    // const data = this.state.musicInfo || {}
    const data = mockData.list[this.state.currentIndex]
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bgContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: deviceInfo.deviceHeight,
    width: deviceInfo.deviceWidth
  },
  navBarStyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: deviceInfo.deviceWidth,
    height: 64,
    borderWidth: 0.5,
    borderColor: commonStyle.lineColor
  },
  navBarContent: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  title: {
    color: commonStyle.white,
    fontSize: 14
  },
  subTitle: {
    color: commonStyle.white,
    fontSize: 11,
    marginTop: 5
  },
  djCard: {
    width: 270,
    height: 270,
    marginTop: 185,
    borderColor: commonStyle.gray,
    borderWidth: 10,
    borderRadius: 190,
    alignSelf: 'center',
    opacity: 0.2
  },
  playerStyle: {
    position: 'absolute',
    width: deviceInfo.deviceWidth,
  },
  progressStyle: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 80
  },
  slider: {
    flex: 1,
    marginHorizontal: 5,
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    marginVertical: 30
  },
  cdStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})