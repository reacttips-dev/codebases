import { ISchemaObject } from './schema-object';

// Binary
// Below types are allowing us to send one or more binary contents contained in other schema objects
// Will be sent more efficiently over the network
export enum BlobRefType {
    // If this is set then there is no way to get the binary data
    None = 0,
    // When this is set value is URL we can simply call HTTPS GET to fetch binary data. This URL must be on the AL service allow-list.
    HttpsGetDownloadUrl
}

export interface IBlobRef {
    readonly refType: BlobRefType;
    readonly value: string;
}

export interface IBlob extends ISchemaObject {
    // Unique Id set for the content when uploading it. This is set by client and must be unique for the whole session.
    readonly id: string;

    // Size of data in bytes
    readonly sizeBytes: number;

    // Actual data or AL internal Id used for fetching data. Optional if data is not delivered at this point in time.
    // If it is internal Id it is created and maintained by AL.
    readonly data?: Uint8Array;

    // Reference to data. Optional if data/reference is not delivered at this point in time.
    readonly dataPointer?: IBlobRef;
}

// Binary
// The base class for all schema objects that have large binary portions
// Will be sent more efficiently over the network
export interface IBinary extends ISchemaObject {
    data?: Uint8Array;
}

// TileGroup
// Represents a group of tiles. This can be used by hosts to
// provide any arbitrary grouping of tiles at any level.
export interface ITileGroup extends ISchemaObject {}

// Session
// Represents a user session. A user session can have more than one document.
// It is the root of the whole content tree
export interface ISession extends ITileGroup {
    // The current active user ID
    readonly activeUserId: string;

    // DPIs of client screen
    readonly widthDpi?: number;
    readonly heightDpi?: number;
}

// Document Open Type
// Represents the method with which the document was opened at the client
export enum OpenType {
    // the document was newly created
    NewDocument = 0,
    // an old document opened for editing
    EditDocument = 1,
    // document to be viewed
    ViewOnlyDocument = 2
}

// Document
// Represents a document node
export interface IDocument extends ITileGroup {
    // whether the document is readonly or not
    readonly isReadonly: boolean;

    // document title
    readonly title?: string;

    // document url
    readonly url?: string;

    // determines the OpenType of the document
    readonly openType?: OpenType;
}

export class GridConstants {
    static readonly lowerIndexBound = 1;
    static readonly maxNumberOfRows = 1048576;
    static readonly maxNumberOfColumns = 16384;
    static readonly firstColumnName = 'A';
    static readonly lastColumnName = 'XFD';
}

// Represents any cell within a table. This can be used by both Word and Excel tables.
export interface IGridCell extends ISchemaObject {
    // The column number of this cell
    readonly column: number;

    // The row number of this cell
    readonly row: number;
}

// Represents the context of the grid neighborhood for when a grid is passed to
// execute workflow as an array. Used by the workflow to reconstruct the neighborhood
export interface IGridNeighborhoodContext extends ISchemaObject {
    // The width of the neighborhood
    readonly width: number;

    // The height of the neighborhood
    readonly height: number;

    // The width of the retrieved part of neighborhood
    readonly retrievedWidth: number;

    // The height of the retrieved part of neighborhood
    readonly retrievedHeight: number;

    // The row of the cell at the top left of the neighborhood
    readonly neighborhoodTopRow: number;

    // The column of the cell at the top left of the neighborhood
    readonly neighborhoodLeftColumn: number;

    // The row of the cell at the top left of the grid inside the neighborhood
    readonly targetGridTopRow: number;

    // The column of the cell at the top left of the grid inside the neighborhood
    readonly targetGridLeftColumn: number;

    /**
     * relative location of top row of target grid in the neighborhood
     */
    readonly targetGridRelativeTopRow: number;

    /**
     * relative location of left column of target grid in the neighborhood
     */
    readonly targetGridRelativeLeftColumn: number;

    /**
     * The number of non-empty cells of the neighborhood
     */
    readonly numberOfNonEmptyCells: number;
}

/**
 * Base interface represents all the context information for dynamic workflow execution.
 */
export interface IDynamicContext extends ISchemaObject {}
