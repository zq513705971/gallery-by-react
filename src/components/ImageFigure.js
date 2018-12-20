import React from 'react';
import { observer, inject } from "mobx-react";

@observer
export default class ImageFigure extends React.Component {

    constructor(props) {
        super(props);

        var store = this.props.store;
        var index = this.props.index;
        //var imageData = store.imgsArrangeArr[index];

        this.state = {
            store: store,
            index: index
        };

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseOver(e) {
        var store = this.props.store;
        store.auto(false);
        e.stopPropagation();
        e.preventDefault();
    }

    onMouseOut(e) {
        var store = this.props.store;
        !store.isInverse && store.auto(true);
        e.stopPropagation();
        e.preventDefault();
    }

    // imgFigure 的点击处理函数
    handleClick = (e) => {
        var store = this.props.store;
        var index = this.props.index;
        var data = store.imgsArrangeArr[index];

        // 如果在中间就翻转,否则就居中
        if (data.isCenter) {
            store.inverse();
        } else {
            store.center(index);
        }
        store.isInverse && store.auto(false);

        e.stopPropagation();
        e.preventDefault();
    }

    autoToggle(auto) {
        this.props.autoToggle(auto);
    }

    render() {
        //console.log("ImageFigure");

        var store = this.props.store;
        var index = this.props.index;
        var data = store.imgsArrangeArr[index];

        let styleObj = undefined;

        var imageData = data.data.element;

        // 如果 pos 属性中指定了这张图片的位置,则使用
        if (data.pos) {
            styleObj = data.pos;
        }
        // 如果图片的旋转角度不为零,则添加旋转角度
        if (data.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', '']).forEach((value) => {
                styleObj[value] = 'rotate(' + + data.rotate + 'deg)';
            })
        }

        let imgFigureClassName = 'img-figure';
        // 使中心图片不被其他图片遮住
        if (data.isCenter) {
            styleObj = store.centerPos;
            imgFigureClassName += store.isInverse ? ' is-inverse' : '';
        }
        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
                <img src={imageData.imageUrl} alt={imageData.title} />
                <figcaption>
                    <h2 className="img-title">{imageData.title}</h2>
                    <div className="img-back" style={data.isCenter && store.isInverse ? { backfaceVisibility: "visible" } : { backfaceVisibility: "hidden" }} onClick={this.handleClick}>
                        <p>{imageData.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}
