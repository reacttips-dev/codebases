// This file is auto-generated by the "tsproxygen.exe" tool. Manual modification is not recommended.
import type MoveItemRequest from '../contract/MoveItemRequest';

export default function moveItemRequest(data: MoveItemRequest): MoveItemRequest {
    let result: MoveItemRequest = {
        __type: 'MoveItemRequest:#Exchange',
        ...data,
    };

    return result;
}
