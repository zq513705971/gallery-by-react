require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import ImageFigure from '../components/ImageFigure.js';
import ControllerUnit from '../components/ControllerUnit.js';

let imageDatas = require("../data/imageDatas.json");

imageDatas = (function genImagesUrl(imageDatasArr) {
  for (let index = 0; index < imageDatasArr.length; index++) {
    const imageData = imageDatasArr[index];
    imageData.imageUrl = require("../images/" + imageData.fileName);
    imageDatasArr[index] = imageData;
  }
  return imageDatasArr;
})(imageDatas);

/**
 * 随机返回最大值和最小之间的一个数
 * @param {number} low 最小值
 * @param {number} high 最大值
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low)
}


// 获取 0 - 30° 的正负值
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}

class AppComponent extends React.Component {
  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    },
    size: [0, 0],
    scale: 1.2
  }

  constructor(props) {
    super(props);

    this.state = {
      centerIndex: 0,
      timer: undefined,
      imgsArrangeArr: [
        {
          // 位置定位
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0, // 旋转角度
          isInverse: false, // 图片正反面,默认为正面
          isCenter: false //图片是否居中,默认不居中
        }
      ]
    };

    this.autoToggle = this.autoToggle.bind(this);
  }

  componentDidMount() {
    //拿到舞台大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDom.scrollWidth;
    let stageH = stageDom.scrollHeight;
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);

    // 获取图片大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDom.scrollWidth;
    let imgH = imgFigureDom.scrollHeight;
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);

    this.Constant.size[0] = imgW;
    this.Constant.size[1] = imgH;

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW * this.Constant.scale,
      top: halfStageH - halfImgH * this.Constant.scale
    }

    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    let centerIndex = 0;
    this.reArrange(centerIndex);
    this.autoToggle(true);
  }

  /**
   * 指定居中的哪个图片
   * */
  reArrange(centerIndex) {
    // 获取各个区域的边界值
    let imgsArrangeArr = this.state.imgsArrangeArr;
    let Constant = this.Constant;
    let centerPos = Constant.centerPos;
    let hPosRange = Constant.hPosRange;
    let vPosRange = Constant.vPosRange;
    let hPosRangeLeftSecX = hPosRange.leftSecX;
    let hPosRangeRightSecX = hPosRange.rightSecX;
    let hPosRangeY = hPosRange.y;
    let vPosRangeTopY = vPosRange.topY;
    let vPosRangeX = vPosRange.x;

    // 布局在上侧区域图片的状态信息
    let imgsArrangTopArr = [];
    // 取零个或一个放进上侧区域
    let topImgNum = Math.floor(Math.random() * 2);
    // 标记布局在上侧图片是从数组对象的哪个位置取出来的
    let topImgSpliceIndex = 0;

    // 声明一个数组对象用于存放居中状态图片的位置信息
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 的图片, 居中的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      scale: Constant.scale,
      isCenter: true,
      size: Constant.size
    }

    // 取出要布局在上侧区域的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    })

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      // 前半部分布局在左边,后半部分布局在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    // 把布局在上侧的图片放回 imgsArrangeArr 数组中
    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangTopArr[0]);
    }

    // 把布局在中间的图片放回在 imgsArrangeArr 数组中
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr,
      centerIndex: centerIndex
    })
  }

  /**
   * 利用 rearrange 函数,居中对应的 index 的图片
   * @param {number} Index 需要被居中的图片所对应的 index
   * @returns {Function}
   */
  center(index) {
    return () => {
      this.reArrange(index)
    }
  }

  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  autoToggle(auto) {
    var self = this;
    if (auto) {
      this.state.timer && clearInterval(this.state.timer);
      let centerIndex = this.state.centerIndex;
      let timer = setInterval(function () {
        self.reArrange(((++centerIndex) + imageDatas.length) % imageDatas.length);
      }, 2500);
      this.setState({
        timer: timer
      });
    } else
      this.state.timer && clearInterval(this.state.timer);
  }

  render() {
    var controllerUnits = [], imgFigures = [];

    imageDatas.forEach((element, index) => {
      // 初始化 imgsArrangeArr 数组
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImageFigure key={index} data={element} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} autoToggle={this.autoToggle} inverse={this.inverse(index)} />)
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} autoToggle={this.autoToggle} inverse={this.inverse(index)} />)
    })

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
