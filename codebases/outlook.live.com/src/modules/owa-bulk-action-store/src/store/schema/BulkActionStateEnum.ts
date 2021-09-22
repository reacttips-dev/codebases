enum BulkActionStateEnum {
    Uninitialized = 0,
    Running = 1,
    Cancelled = 2,
    Complete = 3,
    Failed = 4,
    Timeout = 5,
    Cancelling = 6,
}

export enum BulkActionStateServerEnum {
    Uninitialized = 0,
    Running = 1,
    Cancelled = 2,
    Complete = 3,
    Failed = 4,
    Timeout = 5,
}

export default BulkActionStateEnum;
