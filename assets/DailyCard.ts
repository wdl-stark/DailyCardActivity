import HttpUtils from "./HttpUtilsTs";
import RecordItem from "./RecordItem";

const fontSize = 18;
const ServerGate = "test.zjhaa.cn:8002";
const {ccclass, property} = cc._decorator;
// window.addEventListener('message', function (e) {
//     var data = e.data;//参数
//     window.alert(e.data);
// });
@ccclass
export default class DailyCard extends cc.Component {

    @property(cc.Label) private mySignUpTimes: cc.Label = null;
    @property(cc.Label) private myTotalSignUpNum: cc.Label = null;
    @property(cc.Label) private signInTime: cc.Label = null;
    @property(cc.Label) private todaySignUpCount: cc.Label = null;
    @property(cc.Label) private yestodaySignInCount: cc.Label = null;
    @property(cc.Label) private signInIncomeRate: cc.Label = null;

    @property(cc.Node) private rankBox: cc.Node = null;
    @property(cc.Node) private ruleBox: cc.Node = null;
    @property(cc.Node) private noRecordNode = null;
    @property(cc.Node) private recordInfoNode = null;
    @property(cc.Prefab) private recordItem = null;
    @property(cc.Node) private content = null;
    @property(cc.Node) private lock = null;
    @property(cc.Button) private signInButton = null;
    @property([cc.SpriteFrame]) private numberSprites = [];
    @property(cc.Node) private tomorrowRewardPoolNode = null;
    @property(cc.Node) private todayRewardPoolNode = null;
    private _data = null;
    private httpUtils = new HttpUtils();
    public set HasRecord(value)
    {
        this.noRecordNode.active = !value;
        this.recordInfoNode.active = value;
    }
    protected onLoad()
    {
        window.DailyCard = this;
        this.rankBox.active = false;
        this.ruleBox.active = false;
    }

    protected start () {
        this.playerInfo(window.playerInfoData);
    }
    // 报名
    public OnSignUpBtnClicked()
    {
        this.callServerByClient("object.playerHandler.onWholePeopleSign",JSON.stringify(this._data));
    }
    // 签到打卡
    public OnSignInBtnClicked()
    {
        this.callServerByClient("object.playerHandler.onWholePeopleCard",JSON.stringify(this._data))
    }

    public playerInfo(body) {
        
        // alert(JSON.stringify(body));
        var nickname = body.nickname;
        var uid = body.uid;
        var channel = body.channel;
        var version = body.version;
        var token =body.token;
        var activityId = body.activityId;
        console.log(nickname,uid,channel,version,token,activityId);
        if (!nickname || !uid || !channel || !version || !token|| !activityId) {
            alert("获取用户信息失败！");
            return;
        }

        

        this._data ={
            questId:activityId
        };

        this.callServerByClient("object.playerHandler.onWholePeopleCount",JSON.stringify(this._data));

        // let data1 = {
        //     uid: uid,
        // };
        let url = "http://"+ServerGate+"/userInfoCard?uid="+uid;
        // alert("url="+url);
        this.httpUtils.httpGets(url,(data)=>{
            // alert("httpPost:data="+JSON.stringify(data));
            data = JSON.parse(data);
            if (data.error == false) {
                console.log(data);
                var result=data.result;
                var data=data.data;
                this.content.removeAllChildren();
                this.HasRecord = data.length > 0;
                if(data.length>0){
                    // this.noRecordNode.active = false;
                    for(let i=0;i<data.length;i++)
                    {
                        if(parseInt(data[i].sign_status)===1){
                            data[i].sign_status="已打卡";
                        }else {
                            data[i].sign_status="未打卡";
                        }
                        let recordNode = cc.instantiate(this.recordItem);
                        recordNode.parent = this.content;
                        recordNode.getComponent(RecordItem).SetData(data[i]);
                    }
                }else{
                    // this.noRecordNode.active = true;
                }
            }else {
                

            }
        });
        
    }
    public activitycallback(body) {
            // alert("activitycallback,"+JSON.stringify(body));
            var command=body.command;
            var code=body.code;
            var error=body.error;
            switch (command){
                case "onWholePeopleSign":{
                    if(code==200&&error==false){
                        alert("报名成功");
                        location.reload()
                    }else if(code==40409&&error==true) {
                        alert(body.msg);
                    }else if(code==9004||code==7002) {
                        alert("金币不足");
                    }
                    else {
                        alert(code);
                    }
                    break
                }
                case "onWholePeopleCard":{
                    if(code==200&&error==false){
                        alert("打卡成功");
                        location.reload()
                    }else if(code==40409&&error==true) {
                        alert(body.msg);
                    }else {
                        alert(code);
                    }
                    break
                }
                case "onWholePeopleCount":{
                    
                    if(code==200&&error==false){
                        let yesCardInfo=body.yesCardInfo;
                        // yesCardInfo.totalPool = 12345678;// for test
                        let todayCardInfo=body.todayCardInfo;
                        // todayCardInfo.totalPool = 23456789; // for test
                        let totalPoolY= (yesCardInfo.totalPool + "").split("");//.reverse();
                        let totalPool=(todayCardInfo.totalPool + "").split("");//.reverse();
                        this.todaySignUpCount.string = todayCardInfo.sign_num;
                        this.yestodaySignInCount.string = yesCardInfo.cardNum;
                        this.signInIncomeRate.string = yesCardInfo.incomeRate;
                        this.mySignUpTimes.string = todayCardInfo.mySignNum;
                        this.myTotalSignUpNum.string = todayCardInfo.myTotalSignNum;
                        this.signInTime.string = body.sign_card_time.start+"-"+body.sign_card_time.end;
                        let  flag=body.card_flag;
                        if(flag){
                            this.lock.active = false;
                            this.signInButton.interactable = true;
                        }else{
                            this.lock.active = true;
                            this.signInButton.interactable = false;
                        }
                        for(let i=0;i<totalPoolY.length;i++){
                            let node = new cc.Node();
                            let sprite = node.addComponent(cc.Sprite);
                            sprite.spriteFrame = this.numberSprites[totalPoolY[i]];
                            let posX = i * fontSize - (totalPoolY.length * fontSize)/2;
                            node.position = cc.v2(posX,0);
                            this.tomorrowRewardPoolNode.addChild(node);
                        }
                        for(let n=0;n<totalPool.length;n++){
                            let node = new cc.Node();
                            let sprite = node.addComponent(cc.Sprite);
                            sprite.spriteFrame = this.numberSprites[totalPool[n]];
                            let posX = n * fontSize - (totalPool.length * fontSize)/2;
                            node.position = cc.v2(posX,0);
                            this.todayRewardPoolNode.addChild(node);
                        }

                    }else if(code==40409&&error==true) {
                        alert(body.msg);
                    }else {
                        alert(code);
                    }
                    break
                }
            }
    }


    public callServerByClient(router,data)
    {
        console.log(router,data)
        window.location.href = "uniwebview://callServerByClient?route=" + router +"&data="+data;
    }
    public OnRuleBtnClicked()
    {
        this.ruleBox.active = true;
    }

    public OnRecordBtnClicked()
    {
        this.rankBox.active = true;
    }
    public OnCloseBtnClicked()
    {
        this.ruleBox.active = false;
        this.rankBox.active = false;
    }
}
