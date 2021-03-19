import { api, LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi'
import ROOM_INFO__C_OBJECT from '@salesforce/schema/Room_Info__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import FILTER_MESSAGE from '@salesforce/messageChannel/roomMessageChannel__c';

export default class roomSearch extends LightningElement {
    @api type;
    @api ac;
    @api startdate;
    @api enddate;
    @api today = new Date();

    typeoptions;
   
    @wire(getObjectInfo, { objectApiName: ROOM_INFO__C_OBJECT })
    objectInfo;

    @wire(getPicklistValuesByRecordType, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        objectApiName: ROOM_INFO__C_OBJECT
    })
    wiredRecordtypeValues({ data, error }) {
        if (data) {

            this.typeoptions = data.picklistFieldValues.Type__c.values;
            
        }
        if (error) {
            console.log(error);
        }
    }

    handleACChange(event){
        if(event.target.checked)
        this.ac = true;
        else
        this.ac = false;
    }
    handleTypeChange(event){
        this.type = event.target.value;
    }
    handleEndDate(event){
        this.enddate = event.target.value;
    }
    handleStartDate(event){
        this.startdate = event.target.value;
    }

    @wire(MessageContext)
    messageContext;

    showRooms(){
        if(this.startdate === null || this.enddate === null || this.startdate === undefined || this.enddate === undefined){

            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Start Date and End Date is mandatory',
                variant : 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        } 
        else if(this.startdate < this.today || this.enddate < this.today){
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Start Date or End Date should not be earlier than today',
                variant : 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
        else if(this.startdate >= this.enddate ){

            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Start Date should not be later than End Date',
                variant : 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        } 
        else{
            const message = {
                type : this.type,
                startdate : this.startdate,
                enddate : this.enddate,
                ac: this.ac
            };
            publish(this.messageContext, FILTER_MESSAGE, message);
            console.log("Message is being published succesfully");
        }
    }
}