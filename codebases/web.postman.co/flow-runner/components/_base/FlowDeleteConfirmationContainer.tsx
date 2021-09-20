"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const DeleteConfirmationModal_1 = __importDefault(require("../../../js/components/collections/DeleteConfirmationModal"));
const DeleteConfirmationContainer = () => {
    const [isDisabled, setDisabled] = react_1.useState(false), [isOpen, setOpen] = react_1.useState(false), [onDelete, setOnDelete] = react_1.useState(null), [onError, setOnError] = react_1.useState(null), keymapRef = react_1.useRef(null);
    function handleOpen(callback, errorCallback) {
        var _a;
        setOnDelete(() => callback);
        setOnError(() => errorCallback);
        setOpen(true);
        (_a = keymapRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }
    react_1.useEffect(() => {
        pm.mediator.on('showDeleteFlowModal', handleOpen);
        return () => {
            pm.mediator.off('showDeleteFlowModal', handleOpen);
        };
    }, []);
    function handleClose() {
        setOpen(false);
        setDisabled(false);
        setOnDelete(null);
        setOnError(null);
    }
    function handleConfirm() {
        return __awaiter(this, void 0, void 0, function* () {
            setDisabled(true);
            try {
                onDelete && (yield onDelete());
            }
            catch (err) {
                onError && onError(err);
            }
            handleClose();
        });
    }
    return (react_1.default.createElement(DeleteConfirmationModal_1.default, { isDisabled: isDisabled, entity: 'FLOW', primaryAction: isDisabled ? 'Deleting' : 'Delete', preventFocusReset: true, isOpen: isOpen, onConfirm: handleConfirm, onRequestClose: handleClose, keymapRef: keymapRef }));
};
exports.default = DeleteConfirmationContainer;
