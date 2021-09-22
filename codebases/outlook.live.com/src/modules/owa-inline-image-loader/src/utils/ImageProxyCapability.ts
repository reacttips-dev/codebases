/**
 * Per definition in substrate: /sources/dev/services/src/Services/Core/Types/ImageProxyCapability.cs
 */
enum ImageProxyCapability {
    None = 'None',
    OwaProxy = 'OwaProxy',
    ConnectorsProxy = 'ConnectorsProxy',
    Compose = 'Compose',
    OwaAndConnectorsProxy = 'OwaAndConnectorsProxy',
    OwaConnectorsProxyAndCompose = 'OwaConnectorsProxyAndCompose',
}

export default ImageProxyCapability;
