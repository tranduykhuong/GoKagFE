/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-expressions */
import React from 'react';
import ContentLoader from 'react-content-loader';

const ChartPlaceholder = () => (
  <>
    <div style={{ padding: 30, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20 }}>
      <ContentLoader width="100%" height={340} speed={1} foregroundColor="#ddd">
        <rect x="10" y="10" rx="5" ry="5" width="40%" height="16" />
        <rect x="10" y="34" rx="5" ry="5" width="20%" height="16" />

        <rect x="40%" y="40" rx="50%" ry="50%" width="200" height="200" />
        <rect x="40%" y="260" rx="5" ry="5" width="200" height="18" />
        <rect x="40%" y="284" rx="5" ry="5" width="160" height="18" />
        <rect x="40%" y="308" rx="5" ry="5" width="180" height="18" />
      </ContentLoader>
    </div>
    <div style={{ padding: 30, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20 }}>
      <ContentLoader width="100%" height={340} speed={1} foregroundColor="#ddd">
        <rect x="10" y="10" rx="5" ry="5" width="40%" height="16" />
        <rect x="10" y="34" rx="5" ry="5" width="20%" height="16" />

        <rect x="10" y="80" rx="5" ry="5" width="100%" height="1" />
        <rect x="10" y="90" rx="5" ry="5" width="70%" height="40" />
        <rect x="10" y="140" rx="5" ry="5" width="100%" height="1" />
        <rect x="10" y="150" rx="5" ry="5" width="50%" height="40" />
        <rect x="10" y="200" rx="5" ry="5" width="100%" height="1" />
        <rect x="10" y="210" rx="5" ry="5" width="60%" height="40" />
        <rect x="10" y="260" rx="5" ry="5" width="100%" height="1" />
        <rect x="10" y="270" rx="5" ry="5" width="30%" height="40" />
        <rect x="10" y="320" rx="5" ry="5" width="100%" height="1" />

        <rect x="10" y="79" rx="5" ry="5" width="1" height="243" />
      </ContentLoader>
    </div>
  </>
);

export default ChartPlaceholder;
