
const {ccclass, property} = cc._decorator;

@ccclass
export default class RecordItem extends cc.Component {

    @property(cc.Label) private daily = null;
    @property(cc.Label) private count = null;
    @property(cc.Label) private fee = null;
    @property(cc.Label) private sign_status = null;
    @property(cc.Label) private income = null;

    public SetData(info)
    {
        this.daily.string = info.daily;
        this.count.string = info.num;
        this.fee.string = info.fee;
        this.sign_status.string = info.sign_status;
        this.income.string = info.income;
    }

}
