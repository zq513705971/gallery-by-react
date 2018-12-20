import { observable, action, computed, observe, extendObservable, autorun } from "mobx";

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

class ArrangeImage {
    @observable data = {
        element: undefined,
        index: undefined
    };
    @observable pos = {
        left: 0,
        top: 0
    }
    @observable rotate = 0;
    @observable isCenter = false;

    constructor(element, index) {
        this.data.element = element;
        this.data.index = index;
    }

    @action.bound
    setPos = (pos) => {
        this.pos.left = pos.left;
        this.pos.top = pos.top;
    }

    @action.bound
    setRotate = (rotate) => {
        this.rotate = rotate;
    }

    @action.bound
    center = (center) => {
        this.isCenter = center;
    }
}

class ImageStore {
    imageDatas = [];
    timer = undefined;
    centerIndex = 0;

    @observable isInverse = false;
    @observable imgsArrangeArr = [];
    @observable scale = 1.2;
    @observable stageSize = {
        width: 0,
        height: 0
    };
    @observable imageSize = {
        width: 0,
        height: 0
    };

    constructor() {
        this.imageDatas = imageDatas;
        this.imageDatas.forEach((element, index) => {
            this.imgsArrangeArr.push(new ArrangeImage(element, index));
        })
    }

    @action.bound setStageSize(size) {
        this.stageSize = size;
    }

    @action.bound setImageSize(size) {
        this.imageSize = size;
    }

    @action.bound
    auto = (bool) => {
        this.timer && clearInterval(this.timer);
        if (bool) {
            self = this;
            let timer = setInterval(function () {
                self.arrange(((++self.centerIndex) + self.length) % self.length);
            }, 2500);
            this.timer = timer;
        }
    }

    @computed
    get length() {
        return this.imageDatas.length;
    }

    @action.bound
    inverse = () => {
        this.isInverse = !this.isInverse;
    }

    @action.bound
    center = (index) => {
        this.isInverse = false;
        this.arrange(index);
    };

    arrange = (centerIndex) => {
        this.centerIndex = centerIndex;
        var imgsArrangeArr = this.imgsArrangeArr;
        let centerPos = this.centerPos;
        let hPosRange = this.hPosRange;
        let vPosRange = this.vPosRange;

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
        imgsArrangeCenterArr[0].setPos(centerPos);
        imgsArrangeCenterArr[0].setRotate(0);
        imgsArrangeCenterArr[0].center(true);

        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangTopArr.forEach((value, index) => {
            imgsArrangTopArr[index].setPos({
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            });
            imgsArrangTopArr[index].setRotate(get30DegRandom());
            imgsArrangTopArr[index].center(false);
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
            imgsArrangeArr[i].setPos({
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            });
            imgsArrangeArr[i].setRotate(get30DegRandom());
            imgsArrangeArr[i].center(false);
        }

        // 把布局在上侧的图片放回 imgsArrangeArr 数组中
        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangTopArr[0]);
        }

        // 把布局在中间的图片放回在 imgsArrangeArr 数组中
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    }

    //拿到舞台大小
    @computed
    get computedStageSize() {
        return {
            ...this.stageSize,
            halfWidth: Math.ceil(this.stageSize.width / 2),
            halfHeight: Math.ceil(this.stageSize.height / 2)
        }
    };

    // 获取图片大小
    @computed
    get computedImageSize() {
        return {
            ...this.imageSize,
            halfWidth: Math.ceil(this.imageSize.width / 2),
            halfHeight: Math.ceil(this.imageSize.height / 2)
        }
    };

    // 计算中心图片的位置点
    @computed
    get centerPos() {
        var stage = this.computedStageSize;
        var img = this.computedImageSize;
        var pos = {
            zIndex: this.imgsArrangeArr.length + 1,
            width: img.width * this.scale,
            height: img.height * this.scale,
            left: stage.halfWidth - img.halfWidth * this.scale,
            top: stage.halfHeight - img.halfHeight * this.scale
        }
        //console.log(pos);
        return pos;
    };

    // 计算左侧，右侧区域图片排布位置的取值范围
    @computed
    get hPosRange() {
        var stage = this.computedStageSize;
        var img = this.computedImageSize;
        return {
            leftSecX: [-img.halfWidth, stage.halfWidth - img.halfWidth * 3],
            rightSecX: [stage.halfWidth + img.halfWidth, stage.width - img.width],
            y: [-img.halfHeight, stage.height - img.halfHeight]
        }
    };

    // 计算上侧区域图片排布位置的取值范围
    @computed
    get vPosRange() {
        var stage = this.computedStageSize;
        var img = this.computedImageSize;
        return {
            topY: [-img.halfHeight, stage.halfHeight - img.halfHeight * 3],
            x: [stage.halfWidth - img.width, stage.halfWidth]
        }
    };
}


const imageStore = new ImageStore();

export { imageStore };