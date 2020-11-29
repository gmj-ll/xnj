import React, { Component } from 'react';
import { traceEvent } from '../../lib/telemetry.js';
import './helpOverlay.scss';

import Localization from '../../localization/localization';
// import connectionStringInPortal from '../../img/connectionStringInPortal.png';
import img1 from '../../img/step1.png';
import img2_1 from '../../img/step2_1.png';
import img2_2 from '../../img/step2_2.png';
import img2_3 from '../../img/step2_3.png';
import img3_1 from '../../img/step3_1.png';
import img3_2 from '../../img/step3_2.png';

class HelpOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            numOfSteps: 3,
            subStep: 0,
            timeSpan: 3000,
            numOfSubStep: [3, 3, 2],
            offset: []
        };
        if (this.toggleInterval) {
            clearInterval(this.toggleInterval);
        }
        this.toggleInterval = setInterval(() => { this.toggleStep(); }, this.state.timeSpan);
    }

    nextStep = () => {
        if (this.state.step < this.state.numOfSteps - 1) {
            this.gotoStep(this.state.step + 1);
        }
        else {
            this.onClose();
        }
    }

    prevStep = () => {
        if (this.state.step > 0) {
            this.gotoStep(this.state.step - 1);
        }
    }

    gotoStep = (id) => {
        this.setState(() => {
            return {
                step: id,
                subStep: 0
            }
        });
        if (this.toggleInterval) {
            clearInterval(this.toggleInterval);
        }
        this.toggleInterval = setInterval(() => { this.toggleStep(); }, this.state.timeSpan);
    }

    goToSubStep = (id) => {
        this.setState(() => {
            return {
                subStep: id
            }
        });
        if (this.toggleInterval) {
            clearInterval(this.toggleInterval);
        }
    }

    toggleStep = () => {
        this.setState((prev) => {
            return {
                subStep: (prev.subStep + 1) % prev.numOfSubStep[this.state.step]
            }
        });
    }

    changeSubStep = (e) => {
        var wheelData = this.extractDelta(e.nativeEvent);
        if (!wheelData) {
            return;
        }
        if (wheelData < 0) {
            if (this.state.subStep !== this.state.numOfSubStep[this.state.step] - 1) {
                this.goToSubStep(this.state.subStep + 1);
            }
        } else {
            if (this.state.subStep !== 0) {
                this.goToSubStep(this.state.subStep - 1);
            }
        }
    }

    extractDelta(e) {
        if (e.wheelDelta) {
            return e.wheelDelta;
        }
        if (e.deltaY) {
            return e.deltaY * -1;
        }
    }

    onClose = () => {
        this.props.toggleHelpState();
        if (this.state.step == this.state.numOfSteps - 1) {
            traceEvent('help-complete');
        }
        this.setState(() => {
            return {
                step: 0,
                subStep: 0
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (!this.props.needShowHelp && nextProps.needShowHelp) {
            this.setState(() => {
                return {
                    step: 0,
                    subStep: 0
                }
            });
            if (this.toggleInterval) {
                clearInterval(this.toggleInterval);
            }
            this.toggleInterval = setInterval(() => { this.toggleStep(); }, this.state.timeSpan);
        }
    }

    componentDidMount() {
        this.setStepOffset(0);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.step !== this.state.step) {
            this.setStepOffset(this.state.step);
        }
        if(!prevProps.needShowHelp && this.props.needShowHelp) {
            this.setStepOffset(this.state.step);
        }
    }

    setStepOffset = (step) => {
        let tempSubOffsetArray = [];
        let tempSum = 0;
        for (let j = 0; j < this.state.numOfSubStep[step]; j++) {
            tempSubOffsetArray.push(tempSum);
            tempSum += this.allParagraph.children[step].children[j].offsetHeight;
        }
        this.setState(() => {
            return {
                offset: tempSubOffsetArray
            }
        });
    }

    render() {
        return (
            <div className="overlay" style={{ display: this.props.needShowHelp ? "flex" : "none" }}>
                <div className="instruction">
                    <div className="header-bar">
                        <div className="placeholder-2" />
                        <div className="step-container">
                            <div className="step" onClick={this.gotoStep.bind(this, 0)}>
                                <div className="step-circle" />
                                <div className={`step-circle-chosen ${this.state.step === 0 ? '' : 'element-hide'}`} />
                                <span className="step-label" >{Localization.getLocalizedString().helpStep} 1</span>
                            </div>
                            <div className="step" onClick={this.gotoStep.bind(this, 1)}>
                                <div className="step-circle" />
                                <div className={`step-circle-chosen ${this.state.step === 1 ? '' : 'element-hide'}`} />
                                <span className="step-label" >{Localization.getLocalizedString().helpStep} 2</span>
                            </div>
                            <div className="step" onClick={this.gotoStep.bind(this, 2)}>
                                <div className="step-circle" />
                                <div className={`step-circle-chosen ${this.state.step === 2 ? '' : 'element-hide'}`} />
                                <span className="step-label" >{Localization.getLocalizedString().helpStep} 3</span>
                            </div>
                        </div>
                        <div className="placeholder-1" />
                        <div className="close-button" onClick={this.onClose}>
                            ×
                    </div>
                    </div>
                    <div className="content">
                        <div onWheel={this.changeSubStep} className="text-instruction">
                            <div className="text-instruction-title">
                                {(() => {
                                    switch (this.state.step) {
                                        case 0: return Localization.getLocalizedString().helpTitle1;
                                        case 1: return Localization.getLocalizedString().helpTitle2;
                                        case 2: return Localization.getLocalizedString().helpTitle3;
                                        default: return "";
                                    }
                                })()}
                            </div>
                            <div className={`text-instruction-description`} ref={(p) => { this.allParagraph = p; }}>
                                <div className={`paragraph-container ${this.state.step === 0 ? '' : 'element-none'}`}>
                                    <div className={`paragraph ${this.state.subStep === 0 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        1. <span className="bold">{Localization.getLocalizedString().helpContentAssemblyArea}</span>{Localization.getLocalizedString().helpContentAssemblyAreaDescription}
                                </div>
                                    <div className={`paragraph ${this.state.subStep === 1 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        2. <span className="bold">{Localization.getLocalizedString().helpContentCodingArea}</span>{Localization.getLocalizedString().helpContentCodingAreaDescription}
                                </div>
                                    <div className={`paragraph ${this.state.subStep === 2 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        3. <span className="bold">{Localization.getLocalizedString().helpContentConsoleArea}</span>{Localization.getLocalizedString().helpContentConsoleAreaDescription}
                                </div>
                                </div>
                                <div className={`paragraph-container ${this.state.step === 1 ? '' : 'element-none'}`}>
                                    <div className={`paragraph ${this.state.subStep === 0 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        1. {Localization.getLocalizedString().helpContentInThe} <a target="_blank" href="https://www.aliyun.com/">{Localization.getLocalizedString().helpContentAzurePortal}</a> 开通物联网平台。
                                </div>
                                    <div className={`paragraph ${this.state.subStep === 1 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        2. 在物联网平台中创建产品与设备：在物联网平台上为设备注册一个身份，获取设备证书信息（ProductKey、DeviceName和DeviceSecret）。
                                </div>
                                    <div className={`paragraph ${this.state.subStep === 2 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        3. 在钉钉群内新建机器人，在Webhook中获取Token，并设置好安全设置。
                                </div>
                                </div>
                                <div className={`paragraph-container ${this.state.step === 2 ? '' : 'element-none'}`}>
                                    <div className={`paragraph ${this.state.subStep === 0 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        1. 替换编码区域内关于ProductKey、DeviceName、DeviceSecret和钉钉群机器人Token为自己的信息。
                                </div>
                                    <div className={`paragraph ${this.state.subStep === 1 ? 'paragraph-selected' : ''}`} style={{ transform: "translate(0,-" + this.state.offset[this.state.subStep] + "px" }}>
                                        2. 点击 运行 按钮或者输入 "npm start" 以运行应用程序。
                                </div>
                                </div>
                                <div className={`paragraph-scrollbar`} >
                                    <div style={{ height: (100 / this.state.numOfSubStep[this.state.step]) + "%" }} className={`scrollbar-indicator ${this.state.numOfSubStep[this.state.step] <= 1 ? 'element-none' : ''} ${this.state.subStep === 0 ? 'scrollbar-indicator-selected' : ''}`} />
                                    <div style={{ height: (100 / this.state.numOfSubStep[this.state.step]) + "%" }} className={`scrollbar-indicator ${this.state.numOfSubStep[this.state.step] <= 1 ? 'element-none' : ''} ${this.state.subStep === 1 ? 'scrollbar-indicator-selected' : ''}`} />
                                    <div style={{ height: (100 / this.state.numOfSubStep[this.state.step]) + "%" }} className={`scrollbar-indicator ${this.state.numOfSubStep[this.state.step] <= 2 ? 'element-none' : ''} ${this.state.subStep === 2 ? 'scrollbar-indicator-selected' : ''}`} />
                                </div>
                            </div>
                            <div className="operation">
                                <div className={`operation-button-1 ${this.state.step === 0 ? 'element-none' : ''}`} onClick={this.prevStep}>
                                    {Localization.getLocalizedString().helpButtonBack}
                            </div>
                                <div className="operation-button-2" onClick={this.nextStep}>
                                    {this.state.step === this.state.numOfSteps - 1 ? Localization.getLocalizedString().helpButtonGotIt : Localization.getLocalizedString().helpButtonNext}
                                </div>
                            </div>
                        </div>
                        <div onWheel={this.changeSubStep} className="picture-instruction">
                            <div className={`picture-container ${this.state.step === 0 ? '' : 'element-none'}`} >
                                <img className="picture" src={img1} />
                            </div>
                            <div className={`picture-container ${this.state.step === 1 ? '' : 'element-none'}`} >
                                <img className="picture" style={{ left: "0%", transform: "translate(" + this.state.subStep * -100 + "%,0)" }} src={img2_1} />
                                <img className="picture" style={{ left: "100%", transform: "translate(" + this.state.subStep * -100 + "%,0)" }} src={img2_2} />
                                <img className="picture" style={{ left: "200%", transform: "translate(" + this.state.subStep * -100 + "%,0)" }} src={img2_3} />
                            </div>
                            <div className={`picture-container ${this.state.step === 2 ? '' : 'element-none'}`} >
                                <img className="picture" style={{ left: "0%", transform: "translate(" + this.state.subStep * -100 + "%,0)" }} src={img3_1} />
                                <img className="picture" style={{ left: "100%", transform: "translate(" + this.state.subStep * -100 + "%,0)" }} src={img3_2} />
                            </div>
                            <div className="picture-indicator-container" >
                                <div className={`picture-indicator ${this.state.step === 0 || this.state.numOfSubStep[this.state.step] <= 1 ? 'element-none' : ''} ${this.state.subStep === 0 ? 'picture-indicator-selected' : ''}`} onClick={this.goToSubStep.bind(this, 0)} />
                                <div className={`picture-indicator ${this.state.step === 0 || this.state.numOfSubStep[this.state.step] <= 1 ? 'element-none' : ''} ${this.state.subStep === 1 ? 'picture-indicator-selected' : ''}`} onClick={this.goToSubStep.bind(this, 1)} />
                                <div className={`picture-indicator ${this.state.step === 0 || this.state.numOfSubStep[this.state.step] <= 2 ? 'element-none' : ''} ${this.state.subStep === 2 ? 'picture-indicator-selected' : ''}`} onClick={this.goToSubStep.bind(this, 2)} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HelpOverlay;