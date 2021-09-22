import { mutator, action } from 'satcheljs';

let updateAddInArray = action(
    'updateAddInArray',
    (addinsArray: Array<string>, productId: string, isPushOperation: boolean) => ({
        addinsArray,
        productId,
        //This denotes which operation to choose between push and splice
        isPushOperation,
    })
);

mutator(updateAddInArray, actionMessage => {
    if (actionMessage.isPushOperation) {
        actionMessage.addinsArray.push(actionMessage.productId);
    } else {
        actionMessage.addinsArray.splice(
            actionMessage.addinsArray.indexOf(actionMessage.productId),
            1
        );
    }
});

export default updateAddInArray;
