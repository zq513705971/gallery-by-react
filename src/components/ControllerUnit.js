import React from 'react';
import { observer, inject } from "mobx-react";

@observer
export default class ControllerUnit extends React.Component {
    constructor(props) {
        super(props);

        var store = this.props.store;
        var index = this.props.index;
        //var imageData = store.imgsArrangeArr[index];

        this.state = {
            store: store,
            index: index
        };
    }

    // 事件处理函数
    handleClick = (e) => {
        var store = this.props.store;
        var index = this.props.index;
        var data = store.imgsArrangeArr[index];
        // 如果点击的按钮所对应的图片为居中态,则翻转,否则居中
        if (data.isCenter) {
            store.inverse();
        } else {
            store.center(index);
        }
        store.auto(!store.isInverse);

        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        var store = this.props.store;
        var index = this.props.index;
        var data = store.imgsArrangeArr[index];

        //console.log("controllerUnit");

        let contorllerUnitClassName = 'controller-unit';

        // 如果对应的是居中状态的图片,添加居中态的属性
        if (data.isCenter) {
            contorllerUnitClassName += ' is-center';
            // 如果同时也为翻转态的图片,添加翻转态的属性
            if (store.isInverse) {
                contorllerUnitClassName += ' is-inverse';
            }
        }

        return (
            <span className={contorllerUnitClassName} onClick={this.handleClick}></span>
        )
    }
}