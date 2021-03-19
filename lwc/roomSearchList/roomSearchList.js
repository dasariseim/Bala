import { api, LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import FILTER_MESSAGE from '@salesforce/messageChannel/roomMessageChannel__c';
import filteredRoomList from '@salesforce/apex/RoomInfoController.filteredRoomList';

export default class CarSearchList extends LightningElement {
    type='';
    ac=false;
    startdate = null;
    enddate = null;
    isOpen = false;

    test;

    @api
    searchData;
    error;

    @api
    roomObject;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        console.log('Inside connectedCallback');
        this.subscribeMessageChannel();
    }

    subscribeMessageChannel(){
        subscribe(this.messageContext, FILTER_MESSAGE, (result) => this.handleResult(result));
        console.log('Message Subscribed');
        
    }

    handleResult(result){
        if(result.type != undefined){
            this.type = result.type;
        }
        if(result.ac != undefined){
            this.ac = result.ac;
        }
        if(result.startdate != undefined){
            this.startdate = result.startdate;
        }
        if(result.enddate != undefined){
            this.enddate = result.enddate;
        }
        console.log('Value stored');
        console.log(this.ac)
    }

    @wire(filteredRoomList, {
        type : '$type',
        ac : '$ac',
        startdate : '$startdate',
        enddate : '$enddate'
    }) 
    wireddata({error, data}){
        if(data){
            this.searchData = data;
            console.log(JSON.stringify(this.searchData));
            this.error = undefined;
        } else if (error){
            this.searchData = undefined;
            this.error = error;
            console.log('Error is found' , error);
        }
    }

    handleBookingEvent(event){
        this.roomObject = event.detail;
        this.isOpen = true;
        
        const modal = this.template.querySelector('c-modal-room-rental');
        modal.show();
    }
}