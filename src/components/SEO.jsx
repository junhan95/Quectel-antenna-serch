import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, image }) => {
    const siteTitle = "Quectel Antenna Search - 퀵텔 안테나 검색";
    const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || "퀵텔(Quectel) 안테나 검색 엔진 - 5G, LTE, GNSS, WiFi, IoT 안테나를 주파수, 마운팅 타입별로 검색하세요. Find the perfect Quectel antenna for your IoT project.";
    const metaKeywords = keywords || "Quectel, 퀵텔, 안테나, 5G 안테나, LTE 안테나, GNSS, IoT, RF, 무선통신, antenna, 임베디드 안테나, 외장 안테나, Wireless, Quectel antenna";
    const siteUrl = url || "https://quectel-antenna.com/";
    const ogImage = image || "https://quectel-antenna.com/favicon.jpeg";

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
                "description": "퀵텔 안테나 검색 엔진 - IoT, 5G, LTE, GNSS 안테나 검색",
                "inLanguage": "ko",
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
            <meta property="og:image" content={ogImage} />
            <meta property="og:locale" content="ko_KR" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={siteUrl} />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
