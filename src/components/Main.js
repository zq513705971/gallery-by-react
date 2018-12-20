require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { observer, inject } from "mobx-react";
import ImageFigure from '../components/ImageFigure.js';
import ControllerUnit from '../components/ControllerUnit.js';

@inject(["imageStore"]) // 注入对应的store
@observer // 监听当前组件
class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      timer: undefined
    };

    this.autoToggle = this.autoToggle.bind(this);
  }

  componentDidMount() {
    let imageStore = this.props.imageStore;
    //拿到舞台大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDom.scrollWidth;
    let stageH = stageDom.scrollHeight;

    imageStore.setStageSize({ width: stageW, height: stageH });

    // 获取图片大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDom.scrollWidth;
    let imgH = imgFigureDom.scrollHeight;

    imageStore.setImageSize({ width: imgW, height: imgH });

    imageStore.center(0);
    imageStore.auto(true);
  }

  render() {
    var controllerUnits = [], imgFigures = [];

    let store = this.props.imageStore;
    let imgsArrangeArr = store.imgsArrangeArr;
    imgsArrangeArr.forEach((data, index) => {
      imgFigures.push(<ImageFigure store={store} key={index} index={index} ref={'imgFigure' + index} />)
      controllerUnits.push(<ControllerUnit store={store} key={index} index={index} />)
    })

    console.log("main");

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
