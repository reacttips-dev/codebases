const organizationSchema = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: 'Toptal',
    url: 'https://www.toptal.com',
    logo: 'https://www.toptal.com/toptal-logo.png',
    sameAs: [
        'https://twitter.com/toptal',
        'https://www.linkedin.com/company/toptal',
        'https://www.facebook.com/toptal',
        'https://www.youtube.com/channel/UCNqm_euTHZz3o5OnKhUS-oA',
        'https://en.wikipedia.org/wiki/Toptal',
        'https://www.instagram.com/toptal'
    ],
    contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+1.888.604.3188',
        contactType: 'sales'
    }]
}

export default organizationSchema