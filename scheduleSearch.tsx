// 导入样式
import "./scheduleSearch.less";
import { BasePage, PageRegister } from "../../framework/component/page";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { PageSource } from "../../framework/component/pageSource";
import { Cookie } from "../../framework/basic/cookie";
import { ReactDOM } from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { PageEvent, PageType } from "../../framework/component/pageEvent";
import { Json } from "../../framework/basic/json";
import { Focus } from "../../framework/component/focus";
import { Key } from "../../framework/basic/key";
import { HeaderModule } from "../../component/head/head";
import { ToastModule } from '../../component/toast/toast';
import { HElement } from '../../framework/basic/helement';
import { KeyboardModule, InputModule, inputcookie } from '../../component/keyboard/keyboard';
import { CommonLogic } from "../../logics/commonLogic";
import { cityName } from "../../models/cityInfo";


const huixian = require("../../package/images/scheduleSearch/huixian.png");
const huiyuan = require("../../package/images/scheduleSearch/huiyuan.png");
const lanxian = require("../../package/images/scheduleSearch/lanxian.png");
const lanyuan = require("../../package/images/scheduleSearch/lanyuan.png");

enum MType {
    Page,
    Head,
    Main,
    Keyboard,
    Input,
}

interface IRequest {
}

interface IMemo {
    key: number;
    index: number;
}

interface IPageProps {
    identCode: MType.Page;
    event: PageEvent;
}

interface IPageState {
    list: { url: string }[];
}

interface IMainProps {
    identCode: MType.Main;
    event: PageEvent;
}
interface IMainState {
    list: { imgurl: string, hrefurl: string }[];
}

class MainModule extends React.Component<IMainProps, IMainState>{

    constructor(props: IMainProps) {
        super(props);
        this.state = {
            list: [
            ]
        }
    }
    render() {
        return (
            <div class="content">
                <div class="content_left">
                    <div class="content_left_box">
                        <div>
                            <p class="label_sbh">申报号</p>
                            <div tag="focus" class="sbh" id="projNo" data-keydown={React.props({})}>
                                请填写申报号
                            </div>
                        </div>

                        <div>
                            <p class="label_sbh">密码</p>
                            <div tag="focus" class="pwd" id="projPwd" >
                                请填写密码
                            </div>
                        </div>

                        <div class="opration">
                            <div tag="focus" class="submit" data-keydown={React.props({ url: "" })}>提交</div>
                            <div tag="focus" class="cancel" data-keydown={React.props({ url: "" })}>重置</div>
                        </div>
                    </div>
                </div>

                <div class="content_right">
                    <div class="content_right_box">

                        <div class="chushi">
                            <img alt="" src={require("../../package/images/scheduleSearch/sbh.png")} />
                        </div>

                        <div class="jindu">
                            <ul>
                                <li class="xian"><img src="" alt="" /></li>
                                <li class="yuan"><img src="" alt="" /><span>申请已受理</span></li>
                                <li class="xian"><img src="" alt="" /></li>
                                <li class="yuan"><img src="" alt="" /><span>审核中</span></li>
                                <li class="xian"><img src="" alt="" /></li>
                                <li class="yuan"><img src="" alt="" /><span>在办</span></li>
                                <li class="xian"><img src="" alt="" /></li>
                                <li class="yuan"><img src="" alt="" /><span>办结</span></li>
                                <li class="xian"><img src="" alt="" /></li>
                            </ul>
                        </div>

                        <div class="xinxi">
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    subscribeToEvents() {
        this.onfocus((e) => {
        });
        this.onkeydown((e) => {
            if (Key.Right === e.keyCode || Key.Left === e.keyCode || Key.Up === e.keyCode || Key.Down == e.keyCode) {
                // 右侧时候有元素
                let s = Focus.area(this.tags, this.index, e.keyCode)
                if (s) {
                    this.setFocus(s.index);
                }
            }
            else if (Key.Enter === e.keyCode) {
                let memo = {
                    key: this.identCode,
                    index: this.index
                }

                switch (memo.index) {
                    case 0:
                        this.keyboardShow("projNo");
                        break;
                    case 1:
                        this.keyboardShow("projPwd", true);
                        break;
                    case 2:
                        this.submit();
                        break;
                    case 3:
                        this.reset();
                        break;
                    default:
                        break;
                }
            }
            else if(e.keyCode >= Key.Zero &&  e.keyCode <= Key.Nine){
                let indexTemp = this.index
                switch (indexTemp) {
                    case 0:
                        let projNo = new HElement('#projNo')
                        projNo.text().indexOf('请') > -1 ? projNo.text("") : null;
                        KeyboardModule.kenterEvent(e.keyCode-48,'projNo');
                        break;
                    case 1:
                        let projPwd = new HElement('#projPwd')
                        projPwd.text().indexOf('请') > -1 ? projPwd.text("") : null;
                        let projPwdlen = projPwd.text().length;  
                        KeyboardModule.kenterEvent(e.keyCode-48,'projPwd');
                        projPwdlen - projPwd.text().length === 0 ? null : projPwd.text(projPwd.text().replace(/\w|\W/g, "*"));
                        inputcookie.length < 25 ? inputcookie.push((e.keyCode-48).toString()) : null;
                        break;
                    default:
                        break;
                }
            }
            else if (Key.Backspace === e.keyCode) {
                //记录位置
                // let memo = {
                //     key: this.identCode,
                //     index: this.index
                // }
                this.trigger(PageType.Previous);
            }
        })
    }

    componentFocusUpdate() {
        if (!this.tags || !this.tags.length || this.tags.length <= this.index || this.identCode !== this.event.getTargetIdentCode()) {
            return;
        }
        this.tags.removeClass("focus");
        this.tags.eq(this.index).addClass("focus");
    }

    componentDidMount() {
        // 恢复坐标
        if (memo) {
            const { index } = memo;
            this.setFocus(index);

            memo = null;
        }
    }

    keyboardShow(id, pwdType?: boolean, inputTitle?: string) {
        //键盘处理
        ReactDOM.render(<KeyboardModule identCode={MType.Keyboard} event={this.event} up={MType.Input} backIdentCode={MType.Main} pwd={pwdType} id={id} />, document.getElementById('keyboardModule'));
        //输入框处理
        ReactDOM.render(<InputModule identCode={MType.Input} event={this.event} down={MType.Keyboard} backIdentCode={MType.Main} id={id} />, document.getElementById('inputModule'));
        this.event.target(MType.Keyboard);
        this.tags.removeClass("focus").eq(this.index);
    }

    reset() {
        let projNo = new HElement('#projNo');
        let projPwd = new HElement('#projPwd');
        projNo.text("请填写申报号");
        projPwd.text("请填写密码");

        let jindu = new HElement('.jindu');
        let xinxi = new HElement('.xinxi');
        let chushi = new HElement('.chushi');
        jindu.hide();
        xinxi.hide();
        chushi.show();
    }
    
    submit() {
        let projNo = new HElement('#projNo');
        let projPwd = new HElement('#projPwd');
        if(projNo.text().indexOf("请") > -1 || projNo.text() === "" || projNo.text() === null || projNo.text() === undefined){
            toast.html('<p>请输入申报号</p>');
            toast.toast();
            return
        }else if(projPwd.text().indexOf("请") > -1 || projPwd.text() === "" || projPwd.text() === null || projPwd.text() === undefined){
            toast.html('<p>请输入密码</p>');
            toast.toast();
            return
        }

        lgc.getScheduleSearch({ "projNo": projNo.text(),"projPwd": KeyboardModule.getInputValue() }, function (info) {
            if (info._success && info._response.data != undefined && info._response.data.length>0) {
                let data = info._response;
                let dataMax: number = info._response.data.length - 1;   //进度不止一条，取最后一条的状态来判断

                let chushi = new HElement('.chushi');
                chushi.hide();

                //进度及信息显示
                let jindu = new HElement('.jindu');
                let xinxi = new HElement('.xinxi');
                xinxi.html('');
                let temp: string = '';
                temp += '<ul class="xinxi_top"><li><span class="sp1">事项名称：</span><span>' + data.data[dataMax].projName + '</span></li>';
                temp += '<li><span class="sp1">申请人：</span><span>' + data.data[dataMax].applyName + '</span></li>';
                temp += '<li><span class="sp1">申请时间：</span><span>'+ MainModule.strHandle(data.data[dataMax].accepttime) +'</span></li>';
                temp += '<li><span class="sp1">所属部门：</span><span>' + data.data[dataMax].receiveDeptName + '</span></li></ul>';
                let tempE:string = '';
                if (data.data[dataMax].handleStateCode != '') {
                    tempE += '<ul class="xinxi_bottom">';
                    if (data.data[dataMax].transactResultCdoe != '') {
                        tempE += '<li><span class="sp1">办理意见：</span><span>' + data.data[dataMax].transactDescribe + '</span></li>';
                        tempE += '<li><span class="sp1">办理结果：</span><span>' + data.data[dataMax].transactResultName + '</span></li>';
                    }
                    tempE += '<li><span class="sp1">办理人：</span><span>' + data.data[dataMax].operateFlag + '</span></li>';
                    tempE += '<li><span class="sp1">办理操作：</span><span>' + data.data[dataMax].handleStateName + '</span></li><ul>';
                }
                xinxi.html(temp+tempE);
                MainModule.handleShow(data,dataMax);//判断进度显示
                jindu.show();
                xinxi.show();
            }else{
                toast.html('<p>申报号或密码不存在</p>');
                toast.toast();
            }
        })
    }

    //进度判断
    private static handleShow(data,dataMax){
        if(data.data[dataMax].handleStateCode != ''){
			switch(data.data[dataMax].handleStateCode){
			case '0101':
			case '0102':
			case '0103':
				this.picHandle(2);
				break;
			case '0201':
			case '0202':
                this.picHandle(3);
				break;
			case '0301':
			case '0302':
			case '0303':
                this.picHandle(6);				
				break;
			case '0304':
                this.picHandle(8);
				break;
			case '0305':
			case '0501':
				this.picHandle(9);
				break;
			case '0502':
			case '0601':
				this.picHandle(8);
				break;
			default:
                this.picHandle(1);
				break;
			}
		}
    }


    //进度处理
    private static picHandle(length){

        let jinduChildrenLi = new HElement('.jindu').children('ul').children('li');
        jinduChildrenLi.getAll().map((v, index)=>{          
            if(v.getAttribute('class') == 'xian'){
                index<length ? v.children[0].setAttribute('src',lanxian) : v.children[0].setAttribute('src',huixian);
            }else{
                index<length ? 
                    v.children[0].setAttribute('src',lanyuan) : v.children[0].setAttribute('src',huiyuan);v.children[1].setAttribute('style','color:#00ffff');
            }
        })

		switch(length){
		case 1:
		case 2:
			break;
		case 3:
            jinduChildrenLi.eq(1).children('span').attr('style','color:#00ffff;font-size:50px');
			break;
		case 4:
		case 5:
            jinduChildrenLi.eq(3).children('span').attr('style','color:#00ffff;font-size:50px');
			break;
		case 6:
		case 7:
            jinduChildrenLi.eq(5).children('span').attr('style','color:#00ffff;font-size:50px');
			break;
		case 8:
        case 9:
            jinduChildrenLi.eq(7).children('span').attr('style','color:#00ffff;font-size:50px');
			break;
		}
    }
    
    //这里字符串处理
    private static strHandle(str:string){
		return str.substr(0,4) + '-' + str.substr(4,2) + '-' + str.substr(6,2);		
	}
}

let memo: IMemo;
let toast:HElement;
let lgc = new CommonLogic();

class PageModule extends React.Component<IPageProps, IPageState>{
    constructor(props: IPageProps) {
        super(props);
    }
    render() {
        return (
            <div class="index">
                <div class="header">
                    <HeaderModule identCode={MType.Head} event={this.event} up={-1} left={-1} down={MType.Main} right={-1} />
                </div>
                <MainModule identCode={MType.Main} event={this.event} />
                <div id="inputModule"></div>
                <div id="keyboardModule"></div>
                <ToastModule />
            </div>
        );
    }
    subscribeToEvents() {

    }
    componentFocusUpdate() {

    }
}

class Page extends BasePage<IRequest> {
    init() {
        this.source.saveToLocal(document.referrer || "-1");
    }

    load() {
        ReactDOM.render(<PageModule identCode={MType.Page} event={this.event} />, document.getElementById('page'));
        this.event.target(MType.Main);
        toast = new HElement("#showToast");

    }
    openBlank(params) {
        const { url, memo } = params;
        if (memo) {
            this.cokStatus.setCookie(Json.serializ(memo));
        }
        if (url) {
            // console.log(params)
            window.location.href = url;
        }
    }
    openPrevious() {
        let url = this.source.takeToLocal();

        this.cokStatus.clearCookie();
        this.source.removeToLocal();

        if (url) {
            window.location.href = url;
        }
    }
}

PageRegister(Page, {
    handler: [
        MType.Page,
        MType.Head,
        MType.Main,
        MType.Keyboard,
        MType.Input,
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource('scheduleSearch_source_' + cityName),
    cokStatus: new Cookie('scheduleSearch_status_' + cityName)
});