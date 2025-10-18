import React from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Product' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
};

// Predefined structured data for common use cases
export const OrganizationData = {
  name: 'Qurrota Kids',
  url: 'https://qurrota.com',
  logo: 'https://qurrota.com/images/logo.png',
  description: 'Premium products for kids and new mothers. Quality, safety, and joy in every item we offer.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+880 01789846204',
    contactType: 'customer service',
    areaServed: 'Bangladesh',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://facebook.com/qurrotakids',
    'https://twitter.com/qurrotakids',
    'https://instagram.com/qurrota_kids',
  ],
};

export const WebSiteData = {
  name: 'Qurrota Kids',
  url: 'https://qurrota.com',
  description: 'Premium products for kids and new mothers',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://qurrota.com/products?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const HomePageData = {
  name: 'Qurrota Kids - Premium Kids Products & Baby Essentials',
  description: 'Shop the finest collection of kids products, baby essentials, and maternity items. Quality, safety, and joy in every product.',
  url: 'https://qurrota.com',
  mainEntity: {
    '@type': 'Organization',
    name: 'Qurrota Kids',
  },
};

export default StructuredData;
