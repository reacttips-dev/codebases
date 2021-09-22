/*
This file contains the details of the 3P online meeting provider
@Fields
'ID': The addin or product ID of the 3P online meeting provider
'Function': The UILess function that is run when the addin is triggered
'Name': Name of the 3P addin
'FlightName': Flight in OWA to enable this particular 3P addin
*/
export const thirdPartyOnlineMeetingProviderDetails = [
    {
        Id: 'a7ca6c74-33fb-43a4-a3e4-781078f0eff5',
        Function: 'addZoomButton',
        Name: 'Zoom',
        FlightName: 'addin-everyMeetingOnlineClient-Zoom',
    },
    {
        Id: '8d763f92-e8cb-4843-a9ef-9cba0dca8727',
        Function: 'insertMeetingButton',
        Name: 'BlueJeans',
        FlightName: 'addin-everyMeetingOnlineClient-BlueJeans',
    },
    {
        Id: '39403046-5079-4d8b-a7d0-d540c95a3a5b',
        Function: 'funcCreateMeetingButton',
        Name: 'GoToMeeting',
        FlightName: 'addin-everyMeetingOnlineClient-GoToMeeting',
    },
];
