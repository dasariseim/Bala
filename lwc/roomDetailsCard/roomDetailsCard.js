import { api, LightningElement } from 'lwc';

export default class RoomDetailsCard extends LightningElement {

    @api
    myRoom;

    connectedCallback(){
        console.log(JSON.stringify(this.myRoom));
    }

    bookNowEvent(){
        console.log('Event from Child');
        const msg = new CustomEvent('bookingevt', {detail: this.myRoom})
        this.dispatchEvent(msg);
    }
}