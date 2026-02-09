import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url }) => {
    const siteTitle = "Quectel Antenna Search";
    const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || "Find the perfect Quectel antenna for your IoT project. Search by frequency, mounting type, and more. Global 5G/LE/GNSS solutions.";
    const metaKeywords = keywords || "Quectel, Antenna, 5G, 4G, LTE, GNSS, IoT, RF, Wireless";
    const siteUrl = url || "https://quectel-antenna.com/";
    const image = "https://quectel-antenna.com/favicon.jpeg"; // Assuming a default image exists or reuse favicon for now

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://quectel-antenna.com/#organization",
                "name": "Quectel Wireless Solutions",
                "url": "https://www.quectel.com/",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://quectel-antenna.com/favicon.jpeg"
                },
                "sameAs": [
                    "https://www.facebook.com/quectelwireless",
                    "https://twitter.com/Quectel_IoT",
                    "https://www.linkedin.com/company/quectel-wireless-solutions"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://quectel-antenna.com/#website",
                "url": "https://quectel-antenna.com/",
                "name": "Quectel Antenna Search",
                "description": "High Performance IoT Antennas Search Engine",
                "publisher": {
                    "@id": "https://quectel-antenna.com/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://quectel-antenna.com/?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={siteUrl} />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
