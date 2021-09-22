import * as trace from 'owa-trace';

/**
 * Parses ews id, perform required operations and return the mailbox guid
 * @param idBytes - The EWS Id byte array.
 */
export function extractMailboxGuidFromEwsIdBytes(idBytes: Uint8Array) {
    if (!idBytes) {
        return null;
    }
    let ewsIdBytes = idBytes;
    let ewsIdPosition = 0;
    // Ews id is RLE compressed (bytes that do not repeat are written
    // directly, bytes that repeat are written twice, followed by the
    // number of times to write the byte). Need to decompress
    if (ewsIdBytes[0] == 1) {
        ewsIdBytes = rleDecompress(ewsIdBytes);
        if (!ewsIdBytes) {
            return null;
        }
    } else {
        ewsIdPosition = 1;
    }
    // This is required to skip over the idType byte
    ewsIdPosition++;
    // Get the moniker length (stored as int16)
    const nextBytesCount = ewsIdBytes[ewsIdPosition] + (ewsIdBytes[ewsIdPosition + 1] >> 8);
    ewsIdPosition += 2;

    return convertByteArrayToString(ewsIdBytes, ewsIdPosition, nextBytesCount);
}

/**
 * returns true if it is a public folder
 * @param folderId
 */
export function isPublicFolder(folderId: string): boolean {
    if (!folderId) {
        return false;
    }

    try {
        let decodedFolderId = atob(folderId);
        let folderIdBytes = new Uint8Array(decodedFolderId.length);

        for (let i = 0; i < decodedFolderId.length; i++) {
            folderIdBytes[i] = decodedFolderId.charCodeAt(i);
        }

        let folderIdPosition = 0;
        if (folderIdBytes[0] === 1) {
            folderIdBytes = rleDecompress(folderIdBytes);
        } else {
            folderIdPosition = 1;
        }

        return folderIdBytes && folderIdBytes[folderIdPosition] === 1;
    } catch (error) {
        return false;
    }
}

/**
 * Implement RLE decompression
 * @param ewsIdBytes - The compressed EWS Id
 * @returns The decompressed EWS Id
 */
function rleDecompress(ewsIdBytes: Uint8Array) {
    // If decompressedEwsIdBytes is null, the method will just calculate the decompressed size
    // Calculate the required memory needed for the decompressions
    const decompressedLength = decompressEx(ewsIdBytes, null);
    if (decompressedLength == 0) {
        trace.errorThatWillCauseAlert('rleDecompress : Invalid id');
        return null;
    }

    // Allocate the memory and run again
    let decompressedEwsIdBytes = new Uint8Array(decompressedLength);
    decompressEx(ewsIdBytes, decompressedEwsIdBytes);

    return decompressedEwsIdBytes;
}

/**
 * Decompress the ews id
 * @param ewsIdBytes - The compressed EWS Id
 * @param decompressedEwsIdBytes - The output array to fill with the uncompressed EWS Id.
 * @returns The size of the decompressed EWS Id
 */
function decompressEx(ewsIdBytes: Uint8Array, decompressedEwsIdBytes: Uint8Array) {
    let position = 0;

    for (let i = 1; i < ewsIdBytes.length; ++i) {
        if (i == ewsIdBytes.length - 1 || ewsIdBytes[i] != ewsIdBytes[i + 1]) {
            // decompressedEwsIdBytes can be null when calculating the size of the decompressed id
            if (decompressedEwsIdBytes != null) {
                decompressedEwsIdBytes[position] = ewsIdBytes[i];
            }

            position++;
        } else {
            // Because repeat characters are always followed by a character count,
            // if i == input.Length - 2, the character count is missing & the Id is invalid.
            if (i == ewsIdBytes.length - 2) {
                trace.errorThatWillCauseAlert('decompressEx : Invalid id');
                return null;
            }

            // The bytes are the same. Read the third byte to see how many additional
            //  times to write the byte (over and above the two that are already there).
            let runLength = ewsIdBytes[i + 2];
            for (let j = 0; j < runLength + 2; j++) {
                // decompressedEwsIdBytes can be null when calculating the size of the decompressed id
                if (decompressedEwsIdBytes != null) {
                    decompressedEwsIdBytes[position] = ewsIdBytes[i];
                }

                position++;
            }

            // Skip the duplicate byte and the run length.
            i += 2;
        }
    }

    return position;
}

/**
 * Converts byte array to string
 * @param array - Input byte array
 * @param offset - Offset in the byte array
 * @param count - Number of bytes to process
 */
export function convertByteArrayToString(array: Uint8Array, offset: number, count: number) {
    if (offset + count > array.length) {
        trace.errorThatWillCauseAlert(
            'ConvertByteArrayToString: offset + count must not exceed byte array length.'
        );
        return null;
    }
    let result = '';
    for (let i = offset; i < offset + count; i++) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}
