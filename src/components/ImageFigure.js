import React from 'react';

export default class ImageFigure extends React.Component {

    constructor(props) {
        super(props);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseOver(e) {
        this.props.arrange.isCenter && this.props.autoToggle(false);

        e.stopPropagation();
        e.preventDefault();
    }

    onMouseOut(e) {
        !this.props.arrange.isInverse && this.props.arrange.isCenter && this.props.autoToggle(true);

        e.stopPropagation();
        e.preventDefault();
    }

    // imgFigure 的点击处理函数
    handleClick = (e) => {
        // 如果在中间就翻转,否则就居中
        if (this.props.arrange.isCenter) {
            this.inverse();
        } else {
            this.center();
        }
        this.autoToggle(this.props.arrange.isCenter && !this.props.arrange.isInverse);

        e.stopPropagation();
        e.preventDefault();
    }

    autoToggle(auto) {
        this.props.autoToggle(auto);
    }

    center() {
        this.props.center();
    }

    inverse() {
        this.props.inverse();
    }

    render() {
        let styleObj = {};

        // 如果 pos 属性中指定了这张图片的位置,则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        // 如果图片的旋转角度不为零,则添加旋转角度
        if (this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', '']).forEach((value) => {
                styleObj[value] = 'rotate(' + + this.props.arrange.rotate + 'deg)';
            })
        }

        //console.log(this.props.arrange);

        let imgFigureClassName = 'img-figure';
        // 使中心图片不被其他图片遮住
        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
            var size = this.props.arrange.size;
            styleObj.width = size[0] * this.props.arrange.scale;
            styleObj.height = size[1] * this.props.arrange.scale;
        }
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" style={this.props.arrange.isInverse ? { backfaceVisibility: "visible" } : { backfaceVisibility: "hidden" }} onClick={this.handleClick}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}
