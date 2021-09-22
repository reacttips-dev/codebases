export enum PopoutChildState {
    /**
     * Data loading from parent window isn't started
     */
    NotStarted,

    /**
     * Data is loading from parent window
     */
    Loading,

    /**
     * Data has been loaded from parent window
     */
    Ready,
}

export default interface PopoutChildStore {
    state: PopoutChildState;
    isPopoutV2: boolean;
}
