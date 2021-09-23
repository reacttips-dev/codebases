export default function copyToClipboard(value) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(value);
    } else {
        // Save active element to restore for later
        const active = document.activeElement;

        const e = document.createElement('textarea');
        e.value = value;
        document.body.appendChild(e);

        // The next part adds compatibility for iOS devices
        // Convert input field to editable with readonly to stop iOS keyboard opening
        e.contentEditable = true;
        e.readOnly = true;

        // Create a selectable range
        const range = document.createRange();
        range.selectNodeContents(e);

        // Select the range with the value added in
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        e.setSelectionRange(0, 99999);

        document.execCommand('copy');
        document.body.removeChild(e);
        window.getSelection().removeAllRanges();
        active.focus();
    }
}