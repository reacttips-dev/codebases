import { ISchemaObject } from './schema-object';

export enum AnnotationState {
    Undefined = 0,
    //only dealt with on server side
    Created = 10,
    Sent = 20,
    Duplicated = 30, //only to be used for logs -- annotation should never be assigned this state
    //dealt with on client side and server side
    Seen = 40,
    Tried = 50,
    Kept = 60,
    Rejected = 70
}

export interface AnnotationMetaData {
    state?: AnnotationState;
}

/**
 * Base class for all annotations. May have other annotations as children.
 */
export interface IAnnotation extends ISchemaObject {
    /**
     * Unique ID of this annotation. Must not be re-used for an annotation on a
     * different parent (similarly, annotations may be updated or deleted, but
     * may not be moved to a different parent). If this is not set by the workflow
     * that produced the annotation, it will be set to a random GUID by the
     * runtime. If a workflow produces an annotation identical to an existing
     * annotation that differs only by ID, the newer annotation will be discarded
     * and no update will be sent to the client.
     */
    id?: string;

    /**
     * The ID of the owner of the annotation (i.e. the service or the engine that
     * produced the annotation)
     */
    ownerId?: string;

    /**
     * Stable but not necessarily unique identifier representing the range of content covered
     * by this annotation. The method by which this is generated is unspecified
     * and will sometimes vary across different types of annotations, but it
     * should generally be thought of as a hash over all the content within the
     * "invalidation range" of the annotation (that is, the parts of the user content
     * in which any edit will render the annotation stale, possibly including formatting
     * and other metadata in addition to basic content such as text).
     *
     * These may be shared by multiple annotations covering exactly the same content.
     * Random collisions between different regions must be avoided. This hash should
     * have a minimum of 8 bytes of entropy.
     *
     * This is used by Office clients to implement persistence features. If left
     * unset, some features may be turned off for this annotation.
     */
    invalidationHash?: string;

    /**
     * Information about how the user has interacted with the annotation
     * (sent, seen, tried, kept)
     * @cppname Metadata
     */
    M_?: AnnotationMetaData;
}

/**
 * Represents a simple true/false classification annotation.
 */
export interface IBinaryClassificationAnnotation extends IAnnotation {
    /**
     * The name of the classification
     */
    readonly name: string;

    /**
     * The value of the classification
     */
    readonly value: boolean;
}
